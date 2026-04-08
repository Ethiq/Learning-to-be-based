import { z } from 'zod'

const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || ''
const BASESCAN_URL = 'https://api.basescan.org/api'

const TxSchema = z.object({
  timeStamp: z.string(),
  to: z.string().nullable().optional(),
  from: z.string(),
  value: z.string(),
  contractAddress: z.string().optional(),
  isError: z.string().optional(),
})

const TxResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  result: z.array(TxSchema).or(z.string()),
})

export type BaseScanTx = z.infer<typeof TxSchema>

export async function getWalletTransactions(address: string): Promise<BaseScanTx[]> {
  if (!BASESCAN_API_KEY) {
    return []
  }

  const query = new URLSearchParams({
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '10000',
    sort: 'asc',
    apikey: BASESCAN_API_KEY,
  })

  const response = await fetch(`${BASESCAN_URL}?${query.toString()}`, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`BaseScan request failed: ${response.status}`)
  }

  const parsed = TxResponseSchema.safeParse(await response.json())
  if (!parsed.success) {
    throw new Error('Invalid BaseScan payload')
  }

  const { result } = parsed.data
  if (typeof result === 'string') {
    return []
  }

  return result
}
