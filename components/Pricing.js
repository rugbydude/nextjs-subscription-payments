import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { handleSubscribe } from '../utils/stripe';

const Pricing = () => {
  const [prices, setPrices] = useState([]);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchPrices();
    fetchSubscription();
  }, []);

  const fetchPrices = async () => {
    const { data, error } = await supabase.from('prices').select('*');
    if (error) {
      console.error('Error fetching prices:', error);
    } else {
      setPrices(data);
    }
  };

  const fetchSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, prices(*)')
        .eq('user_id', session.user.id)
        .single();
      if (error) {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">Pricing Plans</h1>
          <p className="mt-5 text-xl text-gray-500 sm:text-center">
            Start building for free, then add a site plan to go live. Account plans unlock additional features.
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {prices.map((price) => (
            <div key={price.id} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">{price.name}</h2>
                <p className="mt-4 text-sm text-gray-500">{price.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${price.unit_amount / 100}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <button
                  onClick={() => handleSubscribe(price.id)}
                  className="mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                >
                  {subscription && subscription.prices.id === price.id ? 'Current Plan' : 'Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
