"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Suspense } from "react";
// import StripeCheckout from "@/components/stripe-checkout";
import { convertCurrency } from "@/lib/helper";
import { Plan } from "@/types";

async function fetchPlans(): Promise<Plan[]> {
  const plans = await import("@/lib/data/plans.json");
  return plans.plans as Plan[];
}

async function flouciPaymentCall(e: React.MouseEvent<HTMLButtonElement>, amount: number) {
  e.preventDefault();
  console.log("object", amount);
  try {
    const req = await fetch(`/api/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, method: "Flouci" }),
    });
    const { result } = await req.json();
    window.location.href = result.link;
  } catch (error) {
    console.error("Payment failed:", error);
  }
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Flouci" | "Stripe" | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  useEffect(() => {
    fetchPlans().then(setPlans);
  }, []);

  useEffect(() => {
    if (paymentMethod === "Flouci" && selectedPlan) {
      convertCurrency(selectedPlan.price, "USD", "TND").then(setConvertedAmount);
    }
  }, [paymentMethod, selectedPlan]);

  return (
    <div className="sm:px-6 lg:px-8 pt-24 px-4 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
          Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Plans tailored to your needs
          </p>
        </div>

        {/* Responsive Grid */}
        <div
          className="grid gap-8 mt-16 sm:mt-20"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className="relative p-8 ring-1 ring-gray-200 dark:ring-gray-700 xl:p-10 flex flex-col justify-between bg-white dark:bg-gray-800"
            >
              <div>
                <div className="flex items-baseline justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.price === 0 ? (
                    <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">Free</p>
                  ) : (
                    <p className="text-sm leading-6">
                      <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {plan.price}€
                      </span>
                      <span className="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </p>
                  )}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {plan.description}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckCircle2 className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400" />
                      <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buttons in the same row */}
              {/* <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Dialog> */}
                  {/* <DialogTrigger asChild>
                    <Button
                      className="w-full sm:w-auto text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setPaymentMethod(null);
                      }}
                    >
                      {plan.id === "free" ? "Start" : "Purchase"}
                    </Button>
                  </DialogTrigger> */}
                  {/* <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800"> */}
                    {/* <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">
                        Purchase {selectedPlan ? selectedPlan.name : ""}
                      </DialogTitle>
                      <DialogDescription className="text-gray-600 dark:text-gray-300">
                        Confirm your selection to purchase the{" "}
                        {selectedPlan ? selectedPlan.name : ""} plan.
                      </DialogDescription>
                    </DialogHeader> */}

                    {/* Show Payment Selection Buttons */}
                    {/* <div className="flex justify-between gap-4 py-4">
                      <Button
                        variant="outline"
                        onClick={() => setPaymentMethod("Flouci")}
                        className="flex items-center gap-2 w-full text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Image src="/tunis.png" alt="Flouci" width={24} height={24} />
                        Flouci
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setPaymentMethod("Stripe")}
                        className="flex items-center gap-2 w-full text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Image src="/stripe.png" alt="Stripe" width={24} height={24} />
                        Stripe
                      </Button>
                    </div> */}

                    {/* Flouci Payment Button */}
                    {/* {paymentMethod === "Flouci" && (
                      <DialogFooter className="flex flex-col gap-2">
                        <Button
                          variant="default"
                          disabled={convertedAmount === null}
                          onClick={(e) => flouciPaymentCall(e, convertedAmount ?? 0)}
                          className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white"
                        >
                          {convertedAmount !== null ? (
                            <>Purchase - {convertedAmount} TND</>
                          ) : (
                            <>Converting...</>
                          )}
                        </Button>
                      </DialogFooter>
                    )} */}

                    {/* Stripe Checkout Section */}
                    {/* {paymentMethod === "Stripe" && (
                      <div>
                        <Suspense
                          fallback={
                            <div className="flex flex-col items-center justify-center py-4">
                              <Loader2 className="h-8 w-8 animate-spin text-gray-900 dark:text-white mb-2" />
                              <p className="text-gray-600 dark:text-gray-300">Loading payment...</p>
                            </div>
                          }                        >
                          <StripeCheckout amount={selectedPlan?.price ?? 0} />
                        </Suspense>
                      </div>
                    )} */}
                  {/* </DialogContent>
                </Dialog>
              </div> */}
            </Card>
          ))}
        </div>

        {/* Compare Plans Button */}
        <div className="mt-16 text-center">
          <Link href="/plan-comparison">
            <Button
              className="px-6 py-3 text-lg font-semibold bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white"
              variant="default"
            >
              Compare Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}