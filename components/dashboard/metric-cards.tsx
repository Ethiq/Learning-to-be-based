import { Card } from '@/components/ui/card'
import type { WalletMetrics } from '@/lib/types'

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </Card>
  )
}

export function MetricCards({ metrics }: { metrics: WalletMetrics }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <Metric label="ETH Balance" value={metrics.ethBalance} />
      <Metric label="Total Transactions" value={metrics.totalTransactions} />
      <Metric label="Active Days" value={metrics.activeDays} />
      <Metric label="Contracts Interacted" value={metrics.contractsInteracted} />
      <Metric label="Contracts Created" value={metrics.contractsCreated} />
      <Metric label="Total Volume (ETH)" value={metrics.totalVolumeEth} />
      <Metric label="Wallet Score" value={metrics.score} />
      <Metric label="Rank Tier" value={metrics.tier} />
    </div>
  )
}
