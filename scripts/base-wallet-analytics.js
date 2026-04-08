/**
 * CLI utility for Base wallet analytics.
 * Usage: node scripts/base-wallet-analytics.js 0xabc... --json
 */

const BASE_RPC = process.env.BASE_RPC_URL || 'https://mainnet.base.org'
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || ''

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

async function rpcCall(method, params = []) {
  const response = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  })

  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || `RPC request failed: ${response.status}`)
  }

  return payload.result
}

async function fetchTxs(address) {
  if (!BASESCAN_API_KEY) return []
  const params = new URLSearchParams({
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

  const response = await fetch(`https://api.basescan.org/api?${params.toString()}`)
  const payload = await response.json()

  return Array.isArray(payload.result) ? payload.result : []
}

async function main() {
  const address = process.argv[2]
  const asJson = process.argv.includes('--json')

  if (!isAddress(address)) {
    throw new Error('Provide a valid Base address')
  }

  const [balanceHex, nonceHex, txs] = await Promise.all([
    rpcCall('eth_getBalance', [address, 'latest']),
    rpcCall('eth_getTransactionCount', [address, 'latest']),
    fetchTxs(address),
  ])

  const output = {
    address,
    ethBalance: Number(BigInt(balanceHex) / BigInt(10 ** 12)) / 1e6,
    totalTransactions: parseInt(nonceHex, 16),
    indexedTransactions: txs.length,
  }

  if (asJson) {
    console.log(JSON.stringify(output, null, 2))
    return
  }

  console.log('Base Wallet Analytics')
  console.log('=====================')
  console.log(output)
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
