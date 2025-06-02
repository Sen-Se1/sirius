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
      },
    });
  }

  // Handle subscription cancellation (user cancels subscription)
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    try {
      // Delete the subscription from the database instead of updating it
      await db.orgSubscription.delete({
        where: {
          stripeSubscriptionId: subscription.id,
        },
      });
      console.log(`Subscription ${subscription.id} has been deleted from the database.`);
    } catch (error) {
      console.error("Error processing subscription cancellation:", error);
      return new NextResponse("Error processing subscription cancellation", { status: 500 });
    }
  }

  // Handle subscription expiration or failed payments
  if (event.type === "invoice.payment_failed" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    // If the subscription is past due, it has expired
    const currentDate = new Date();
    const expirationDate = new Date(subscription.current_period_end * 1000);

    if (expirationDate < currentDate) {
      try {
        // Update the subscription's expiration status
        await db.orgSubscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripeCurrentPeriodEnd: expirationDate,
          },
        });
        console.log(`Subscription ${subscription.id} has expired.`);
      } catch (error) {
        console.error("Error processing expired subscription:", error);
        return new NextResponse("Error processing expired subscription", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
