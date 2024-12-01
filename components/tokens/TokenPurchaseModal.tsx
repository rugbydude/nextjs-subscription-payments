import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  popular?: boolean;
  description: string;
}

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (packageId: string) => Promise<void>;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'basic',
    tokens: 100,
    price: 10,
    description: 'Perfect for small projects',
  },
  {
    id: 'pro',
    tokens: 500,
    price: 40,
    popular: true,
    description: 'Most popular choice for teams',
  },
  {
    id: 'enterprise',
    tokens: 2000,
    price: 120,
    description: 'Best value for large organizations',
  },
];

export default function TokenPurchaseModal({ isOpen, onClose, onPurchase }: TokenPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>('pro');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    try {
      setLoading(true);
      await onPurchase(selectedPackage);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Purchase Tokens</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TOKEN_PACKAGES.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-6 cursor-pointer transition-shadow hover:shadow-md ${
                  selectedPackage === pkg.id ? 'ring-2 ring-indigo-600' : ''
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full absolute -top-2 left-1/2 -translate-x-1/2">
                    Popular
                  </span>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{pkg.tokens} Tokens</h3>
                  <p className="text-3xl font-bold mb-2">${pkg.price}</p>
                  <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>
                  <p className="text-sm text-gray-600">${(pkg.price / pkg.tokens).toFixed(2)} per token</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            <p>Tokens can be used for:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Generating AI-powered user stories</li>
              <li>Automated task breakdown</li>
              <li>Sprint planning assistance</li>
              <li>Project documentation generation</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Purchase Tokens'}
          </Button>
        </div>
      </div>
    </div>
  );
} 