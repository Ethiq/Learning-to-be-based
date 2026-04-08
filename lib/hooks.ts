'use client'

import { useQuery } from '@tanstack/react-query'
import type { NetworkStatsResponse, WalletAnalyticsResponse } from '@/lib/types'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.error || 'Request failed')
  }

  return response.json() as Promise<T>
}

export function useNetworkStats() {
  return useQuery({
    queryKey: ['network-stats'],
    queryFn: () => fetchJson<NetworkStatsResponse>('/api/network/stats'),
  })
}

export function useWalletAnalytics(address: string) {
  return useQuery({
    queryKey: ['wallet-analytics', address],
    queryFn: () => fetchJson<WalletAnalyticsResponse>(`/api/wallet/${address}`),
    enabled: Boolean(address),
  })
}
