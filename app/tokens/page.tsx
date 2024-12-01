'use client';

import TokenBalance from '@/components/tokens/TokenBalance';
import TokenHistory from '@/components/tokens/TokenHistory';
import { useTokenHistory } from '@/hooks/useTokenHistory';

export default function TokensPage() {
  const { transactions, usage, stats: tokenStats, loading, error } = useTokenHistory();

  if (loading) return <div className="p-8">Loading token data...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Token Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <TokenBalance />
          </div>

          <div className="lg:col-span-3">
            <TokenHistory
              transactions={transactions}
              usage={usage}
              stats={tokenStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 