export type WalletMetrics = {
  address: string
  ethBalance: number
  totalTransactions: number
  activeDays: number
  firstActivity: string | null
  lastActivity: string | null
  contractsInteracted: number
  contractsCreated: number
  totalVolumeEth: number
  score: number
  tier: string
}

export type ActivityPoint = {
  date: string
  txCount: number
}

export type WalletAnalyticsResponse = {
  metrics: WalletMetrics
  activity: ActivityPoint[]
  topContracts: { address: string; count: number }[]
}

export type NetworkStatsResponse = {
  totalTransactions: number
  activeWallets: number
  dailyActivity: ActivityPoint[]
}
