import { useState } from 'react';
import Card from '@/components/ui/Card';
import { TokenTransaction, TokenUsage, TokenStats } from '@/types/token';
import { formatDate } from '@/lib/utils';

interface TokenHistoryProps {
  transactions: TokenTransaction[];
  usage: TokenUsage[];
  stats: TokenStats;
}

export default function TokenHistory({ transactions, usage, stats }: TokenHistoryProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'usage' | 'analytics'>('transactions');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'transactions'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'usage'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('usage')}
        >
          Usage History
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'analytics'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} tokens
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="space-y-4">
          {usage.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{entry.tokens} tokens used</p>
                  <p className="text-sm text-gray-500">
                    {entry.feature}
                    {entry.project_id && ' • Project: ' + entry.project_id}
                  </p>
                  <p className="text-sm text-gray-500">{entry.description}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(entry.created_at)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Daily Usage</h3>
            <div className="space-y-2">
              {stats.dailyUsage.map((day) => (
                <div
                  key={day.date}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{formatDate(day.date)}</span>
                  <span className="text-sm font-medium">{day.tokens} tokens</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Usage by Feature</h3>
            <div className="space-y-2">
              {stats.usageByFeature.map((feature) => (
                <div
                  key={feature.feature}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{feature.feature}</span>
                  <span className="text-sm font-medium">{feature.tokens} tokens</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:col-span-2">
            <h3 className="text-lg font-medium mb-4">Usage by Project</h3>
            <div className="space-y-2">
              {stats.usageByProject.map((project) => (
                <div
                  key={project.project_id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{project.project_name}</span>
                  <span className="text-sm font-medium">{project.tokens} tokens</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 