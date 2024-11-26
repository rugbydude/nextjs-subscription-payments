import { Suspense } from "react"

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to QuantumScribe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading...</div>}>
          {/* Dashboard cards will go here */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
            {/* Project list */}
          </div>
        </Suspense>
      </div>
    </div>
  )
}
