export function scoreWallet(input: {
  totalTransactions: number
  activeDays: number
  contractsInteracted: number
}): { score: number; tier: string } {
  const txScore = Math.min(input.totalTransactions / 300, 1) * 45
  const activeDaysScore = Math.min(input.activeDays / 120, 1) * 35
  const contractScore = Math.min(input.contractsInteracted / 80, 1) * 20

  const score = Number((txScore + activeDaysScore + contractScore).toFixed(2))

  if (score >= 92) return { score, tier: 'Top 1%' }
  if (score >= 80) return { score, tier: 'Top 10%' }
  if (score >= 65) return { score, tier: 'Top 25%' }
  if (score >= 45) return { score, tier: 'Top 50%' }
  return { score, tier: 'Emerging' }
}
