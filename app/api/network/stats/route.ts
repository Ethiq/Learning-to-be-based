import { NextResponse } from 'next/server'
import { getNetworkStats } from '@/lib/analytics'

export async function GET() {
  try {
    const stats = await getNetworkStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch network stats', detail: error instanceof Error ? error.message : 'Unknown error' },
      { status: 502 }
    )
  }
}
