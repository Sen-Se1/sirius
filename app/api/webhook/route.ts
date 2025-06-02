import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await db.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        stripeCanceledAt: null,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        stripeCanceledAt: null,
      },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      const cancelAtPeriodEnd = subscription.cancel_at_period_end;
      const cancelAt = cancelAtPeriodEnd
        ? new Date(subscription.cancel_at! * 1000)
        : null;

      await db.orgSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripeCanceledAt: cancelAt,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      if (cancelAtPeriodEnd) {
        console.log(
          `Subscription ${subscription.id} is set to cancel at ${cancelAt}`
        );
      } else {
        console.log(`Subscription ${subscription.id} is active`);
      }

      if (subscription.status === "past_due") {
        console.log(`Subscription ${subscription.id} is expired.`);
        await db.orgSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripeCanceledAt: new Date(),
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });
      }
    } catch (error) {
      console.error("Error updating subscription cancellation status:", error);
      return new NextResponse("Error processing subscription cancellation", {
        status: 500,
      });
    }
  }

  if (event.type === "invoice.payment_failed") {
    const subscription = event.data.object as unknown as Stripe.Subscription;

    try {
      await db.orgSubscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripeCanceledAt: new Date(),
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });

      console.log(
        `Subscription ${subscription.id} has expired due to payment failure.`
      );
    } catch (error) {
      console.error("Error handling subscription expiration:", error);
      return new NextResponse("Error processing subscription expiration", {
        status: 500,
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
