// components/stats/StatsCard.tsx
import Card from '@/components/ui/Card';
import { IconType } from '@/components/icons/stats';

interface StatsCardProps {
  title: string;
  value: number;
  trend?: number;
  icon: IconType;
  className?: string;
}

export default function StatsCard({ title, value, trend, icon: Icon, className }: StatsCardProps) {
  const trendColor = trend ? (trend > 0 ? 'text-green-600' : 'text-red-600') : '';
  const trendIcon = trend ? (trend > 0 ? '↑' : '↓') : '';

  return (
    <Card className={className}>
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && (
              <span className={`ml-2 text-sm font-medium ${trendColor}`}>
                {trendIcon} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className="rounded-full bg-indigo-50 p-3">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
      </div>
    </Card>
  );
}
