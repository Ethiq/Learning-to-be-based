/**
 * base-chain-info.js
 *
 * Queries Base mainnet via public RPC to display current chain stats.
 * No dependencies required — uses Node.js built-in fetch (v18+).
 *
 * Usage:
 *   node scripts/base-chain-info.js
 */

const BASE_RPC = 'https://mainnet.base.org'

async function rpcCall(method, params = []) {
  const response = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  })

  const data = await response.json()
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`)
  }
  return data.result
}

function hexToNumber(hex) {
  return parseInt(hex, 16)
}

function formatGwei(weiHex) {
  const wei = BigInt(weiHex)
  const gwei = Number(wei) / 1e9
  return gwei.toFixed(4)
}

function formatEth(weiHex) {
  const wei = BigInt(weiHex)
  const eth = Number(wei) / 1e18
  return eth.toFixed(6)
}

async function main() {
  console.log('Base Mainnet — Chain Info')
  console.log('========================\n')

  // Fetch data in parallel
  const [blockNumberHex, gasPriceHex, chainIdHex] = await Promise.all([
    rpcCall('eth_blockNumber'),
    rpcCall('eth_gasPrice'),
    rpcCall('eth_chainId'),
  ])

  const blockNumber = hexToNumber(blockNumberHex)
  console.log(`Chain ID:       ${hexToNumber(chainIdHex)} (Base Mainnet)`)
  console.log(`Latest Block:   ${blockNumber.toLocaleString()}`)
  console.log(`Gas Price:      ${formatGwei(gasPriceHex)} Gwei`)

  // Get latest block details
  const block = await rpcCall('eth_getBlockByNumber', [blockNumberHex, false])

  const timestamp = new Date(hexToNumber(block.timestamp) * 1000)
  const txCount = block.transactions.length
  const gasUsed = hexToNumber(block.gasUsed)
  const gasLimit = hexToNumber(block.gasLimit)
  const utilization = ((gasUsed / gasLimit) * 100).toFixed(1)

  console.log(`\nLatest Block Details`)
  console.log(`--------------------`)
  console.log(`Block Hash:     ${block.hash}`)
  console.log(`Timestamp:      ${timestamp.toISOString()}`)
  console.log(`Transactions:   ${txCount}`)
  console.log(`Gas Used:       ${gasUsed.toLocaleString()} / ${gasLimit.toLocaleString()} (${utilization}%)`)

  if (block.baseFeePerGas) {
    console.log(`Base Fee:       ${formatGwei(block.baseFeePerGas)} Gwei`)
  }

  // Check a well-known address balance (Base Bridge)
  const bridgeAddress = '0x3154Cf16ccdb4C6d922629664174b904d80F2C35'
  const balanceHex = await rpcCall('eth_getBalance', [bridgeAddress, 'latest'])
  console.log(`\nBase Bridge Balance: ${formatEth(balanceHex)} ETH`)
  console.log(`(Address: ${bridgeAddress})`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
