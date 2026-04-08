import { NextResponse } from 'next/server'
import { getWalletAnalytics } from '@/lib/analytics'
import { isAddress } from '@/lib/utils'

export async function GET(_: Request, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params

  if (!isAddress(address)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  try {
    const data = await getWalletAnalytics(address)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wallet analytics', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    )
  }
}
