import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const handleSubscribe = async (priceId) => {
  const stripe = await stripePromise;
  const { sessionId } = await fetch('/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  }).then((res) => res.json());
  stripe.redirectToCheckout({ sessionId });
};
