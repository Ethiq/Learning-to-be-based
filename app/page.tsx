import Link from 'next/link'
import { WalletSearch } from '@/components/dashboard/wallet-search'

export default function HomePage() {
  return (
    <main className="container-app py-12">
      <section className="rounded-2xl border border-slate-800 bg-card p-6 md:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Base Analytics</p>
        <h1 className="text-3xl font-bold md:text-5xl">Wallet analytics and ranking for Base addresses</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Enter any Base wallet to inspect transaction activity, active-day behavior, contract interaction footprint,
          and a ranking tier generated from on-chain usage signals.
        </p>
        <div className="mt-8">
          <WalletSearch />
        </div>
      </section>

      <section className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
        <Link href="/network" className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-900">
          View Base network stats
        </Link>
      </section>
    </main>
  )
}
