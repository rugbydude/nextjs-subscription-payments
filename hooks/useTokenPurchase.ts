import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface UseTokenPurchaseReturn {
  purchaseTokens: (packageId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useTokenPurchase(): UseTokenPurchaseReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseTokens = async (packageId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Create Stripe Checkout Session
      const response = await fetch('/api/tokens/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payment';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    purchaseTokens,
    loading,
    error,
  };
} 