'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ActivityChart } from '@/components/dashboard/activity-chart'
import { MetricCards } from '@/components/dashboard/metric-cards'
import { Card } from '@/components/ui/card'
import { useWalletAnalytics } from '@/lib/hooks'
import { shortAddress } from '@/lib/utils'

export default function WalletDashboardPage() {
  const params = useParams<{ address: string }>()
  const address = params.address
  const { data, isLoading, error } = useWalletAnalytics(address)

  if (isLoading) {
    return <main className="container-app py-12">Loading wallet analytics...</main>
  }

  if (error || !data) {
    return <main className="container-app py-12 text-rose-400">Unable to load wallet analytics.</main>
  }

  return (
    <main className="container-app space-y-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-blue-400">Wallet Dashboard</p>
          <h1 className="text-3xl font-bold">{shortAddress(data.metrics.address)}</h1>
          <p className="text-slate-400">
            First activity: {data.metrics.firstActivity || 'N/A'} • Last activity: {data.metrics.lastActivity || 'N/A'}
          </p>
        </div>
        <Link href="/" className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-900">
          New search
        </Link>
      </div>

      <MetricCards metrics={data.metrics} />
      <ActivityChart data={data.activity} />

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Top Contract Interactions</h2>
        <div className="space-y-2 text-sm">
          {data.topContracts.length === 0 && <p className="text-slate-400">No contract interactions found.</p>}
          {data.topContracts.map((item) => (
            <div key={item.address} className="flex items-center justify-between rounded-md border border-slate-800 p-2">
              <span className="font-mono text-xs md:text-sm">{item.address}</span>
              <span>{item.count} tx</span>
            </div>
          ))}
        </div>
      </Card>
    </main>
  )
}
