const BASE_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org'

type RpcPayload = {
  jsonrpc: '2.0'
  id: number
  method: string
  params: unknown[]
}

export async function rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
  const payload: RpcPayload = { jsonrpc: '2.0', id: 1, method, params }

  const response = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`)
  }

  const json = await response.json()

  if (json.error) {
    throw new Error(`RPC error: ${json.error.message}`)
  }

  return json.result as T
}

export function hexToNumber(hex: string) {
  return parseInt(hex, 16)
}

export function weiHexToEth(weiHex: string) {
  const wei = BigInt(weiHex)
  return Number(wei) / 1e18
}
