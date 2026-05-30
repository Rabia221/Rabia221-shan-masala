import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured. Use Cash on Delivery instead." },
        { status: 503 },
      );
    }

    const { items } = await request.json();

    const amount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        itemCount: items.length,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
