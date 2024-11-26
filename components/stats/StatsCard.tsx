// components/stats/StatsCard.tsx
interface StatsCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  change?: number
}

export default function StatsCard({ title, value, icon, change }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`ml-2 text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change > 0 ? "+" : ""}{change}%
          </p>
        )}
      </div>
    </div>
  )
}
