'use client'

import { ActivityChart } from '@/components/dashboard/activity-chart'
import { Card } from '@/components/ui/card'
import { useNetworkStats } from '@/lib/hooks'

export default function NetworkPage() {
  const { data, isLoading, error } = useNetworkStats()

  if (isLoading) {
    return <main className="container-app py-12">Loading network stats...</main>
  }

  if (error || !data) {
    return <main className="container-app py-12 text-rose-400">Failed to load network stats.</main>
  }

  return (
    <main className="container-app space-y-6 py-12">
      <h1 className="text-3xl font-bold">Base Network Stats</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-400">Total Transactions</p>
          <p className="text-3xl font-semibold">{data.totalTransactions.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Active Wallets</p>
          <p className="text-3xl font-semibold">{data.activeWallets.toLocaleString()}</p>
        </Card>
      </div>
      <ActivityChart data={data.dailyActivity} />
    </main>
  )
}
