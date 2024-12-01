import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TokenPurchaseModal from './TokenPurchaseModal';
import { useTokens } from '@/hooks/useTokens';
import { IconSpinner } from '@/components/icons';

export default function TokenBalance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    balance, 
    loading, 
    error, 
    isUpdating,
    consumeTokens, 
    refreshBalance,
    clearError 
  } = useTokens();

  const handlePurchase = async (packageId: string) => {
    try {
      await consumeTokens(-100, 'Token purchase'); // Negative amount for purchase
      setIsModalOpen(false);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <IconSpinner className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error.message}</p>
          <Button
            variant="secondary"
            onClick={() => {
              clearError();
              refreshBalance();
            }}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 relative">
        {isUpdating && (
          <div className="absolute top-2 right-2">
            <IconSpinner className="w-4 h-4 animate-spin text-indigo-600" />
          </div>
        )}
        <h2 className="text-lg font-semibold mb-4">Token Balance</h2>
        <div className="text-center">
          <p className="text-3xl font-bold text-indigo-600">
            {balance?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Available Tokens</p>
          
          {balance !== null && balance < 50 && (
            <p className="text-sm text-amber-600 mt-2">
              Low balance! Consider purchasing more tokens.
            </p>
          )}
          
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={() => setIsModalOpen(true)}
          >
            Buy More Tokens
          </Button>
        </div>
      </Card>

      <TokenPurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPurchase={handlePurchase}
      />
    </>
  );
} 