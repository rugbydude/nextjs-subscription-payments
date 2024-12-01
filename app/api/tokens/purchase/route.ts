import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const TOKEN_PACKAGES = {
  basic: {
    tokens: 100,
    price: 10,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
  },
  pro: {
    tokens: 500,
    price: 40,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  enterprise: {
    tokens: 2000,
    price: 120,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
  },
} as const;

export async function POST(request: Request) {
  try {
    const { packageId } = await request.json();
    const selectedPackage = TOKEN_PACKAGES[packageId as keyof typeof TOKEN_PACKAGES];

    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'Invalid package selected' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPackage.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        packageId,
        tokens: selectedPackage.tokens.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Webhook handler for successful payments
export async function handleStripeWebhook(event: Stripe.Event) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { packageId, tokens } = session.metadata!;

    // TODO: Update user's token balance in the database
    // await db.user.update({
    //   where: { id: session.client_reference_id },
    //   data: {
    //     tokenBalance: {
    //       increment: parseInt(tokens),
    //     },
    //   },
    // });

    // TODO: Create a transaction record
    // await db.tokenTransaction.create({
    //   data: {
    //     userId: session.client_reference_id!,
    //     amount: parseInt(tokens),
    //     type: 'PURCHASE',
    //     packageId,
    //     stripeSessionId: session.id,
    //   },
    // });
  }
} 