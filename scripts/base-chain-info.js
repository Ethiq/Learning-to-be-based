/**
 * base-chain-info.js
 *
 * Queries Base mainnet via public RPC to display current chain stats.
 * No dependencies required — uses Node.js built-in fetch (v18+).
 *
 * Usage:
 *   node scripts/base-chain-info.js
 *   node scripts/base-chain-info.js --rpc https://mainnet.base.org
 *   node scripts/base-chain-info.js --address 0x3154Cf16ccdb4C6d922629664174b904d80F2C35
 *   node scripts/base-chain-info.js --json --out docs/base-chain-snapshot.json
 */

const fs = require('node:fs/promises')

const DEFAULT_RPC = 'https://mainnet.base.org'
const DEFAULT_ADDRESS = '0x3154Cf16ccdb4C6d922629664174b904d80F2C35'
const REQUEST_TIMEOUT_MS = 12_000

function parseArgs(argv) {
  const args = {
    rpc: DEFAULT_RPC,
    address: DEFAULT_ADDRESS,
    json: false,
    out: '',
  }

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--rpc') {
      args.rpc = argv[i + 1]
      i += 1
      continue
    }

    if (arg === '--address') {
      args.address = argv[i + 1]
      i += 1
      continue
    }

    if (arg === '--json') {
      args.json = true
      continue
    }

    if (arg === '--out') {
      args.out = argv[i + 1]
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printHelpAndExit(0)
    }
  }

  if (!args.rpc || !args.address) {
    printHelpAndExit(1)
  }

  return args
}

function printHelpAndExit(code) {
  console.log('Usage: node scripts/base-chain-info.js [--rpc <url>] [--address <0x...>] [--json] [--out <file>]')
  process.exit(code)
}

async function rpcCall(rpcUrl, method, params = []) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`RPC HTTP ${response.status} while calling ${method}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`RPC error on ${method}: ${data.error.message}`)
    }

    return data.result
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`RPC timeout after ${REQUEST_TIMEOUT_MS}ms on ${method}`)
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
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

function isHexAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

function buildSnapshot({ rpc, address, chainIdHex, blockNumberHex, gasPriceHex, block, balanceHex }) {
  const gasUsed = hexToNumber(block.gasUsed)
  const gasLimit = hexToNumber(block.gasLimit)

  return {
    generatedAt: new Date().toISOString(),
    rpc,
    chainId: hexToNumber(chainIdHex),
    latestBlock: hexToNumber(blockNumberHex),
    gasPriceGwei: Number(formatGwei(gasPriceHex)),
    latestBlockDetails: {
      hash: block.hash,
      timestamp: new Date(hexToNumber(block.timestamp) * 1000).toISOString(),
      transactions: block.transactions.length,
      gasUsed,
      gasLimit,
      gasUtilizationPercent: Number(((gasUsed / gasLimit) * 100).toFixed(1)),
      baseFeeGwei: block.baseFeePerGas ? Number(formatGwei(block.baseFeePerGas)) : null,
    },
    trackedAddress: {
      address,
      balanceEth: Number(formatEth(balanceHex)),
    },
  }
}

async function maybeWriteSnapshot(out, snapshot) {
  if (!out) {
    return
  }

  await fs.writeFile(out, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
}

async function main() {
  const { rpc, address, json, out } = parseArgs(process.argv)

  if (!isHexAddress(address)) {
    throw new Error(`Invalid address: ${address}`)
  }

  const [blockNumberHex, gasPriceHex, chainIdHex] = await Promise.all([
    rpcCall(rpc, 'eth_blockNumber'),
    rpcCall(rpc, 'eth_gasPrice'),
    rpcCall(rpc, 'eth_chainId'),
  ])

  const block = await rpcCall(rpc, 'eth_getBlockByNumber', [blockNumberHex, false])
  const balanceHex = await rpcCall(rpc, 'eth_getBalance', [address, 'latest'])

  const snapshot = buildSnapshot({ rpc, address, chainIdHex, blockNumberHex, gasPriceHex, block, balanceHex })

  await maybeWriteSnapshot(out, snapshot)

  if (json) {
    console.log(JSON.stringify(snapshot, null, 2))
    return
  }

  console.log('Base Mainnet — Chain Info')
  console.log('========================\n')
  console.log(`RPC URL:        ${snapshot.rpc}`)
  console.log(`Chain ID:       ${snapshot.chainId}`)
  console.log(`Latest Block:   ${snapshot.latestBlock.toLocaleString()}`)
  console.log(`Gas Price:      ${snapshot.gasPriceGwei.toFixed(4)} Gwei`)

  console.log('\nLatest Block Details')
  console.log('--------------------')
  console.log(`Block Hash:     ${snapshot.latestBlockDetails.hash}`)
  console.log(`Timestamp:      ${snapshot.latestBlockDetails.timestamp}`)
  console.log(`Transactions:   ${snapshot.latestBlockDetails.transactions}`)
  console.log(`Gas Used:       ${snapshot.latestBlockDetails.gasUsed.toLocaleString()} / ${snapshot.latestBlockDetails.gasLimit.toLocaleString()} (${snapshot.latestBlockDetails.gasUtilizationPercent.toFixed(1)}%)`)

  if (snapshot.latestBlockDetails.baseFeeGwei !== null) {
    console.log(`Base Fee:       ${snapshot.latestBlockDetails.baseFeeGwei.toFixed(4)} Gwei`)
  }

  console.log(`\nTracked Address Balance: ${snapshot.trackedAddress.balanceEth.toFixed(6)} ETH`)
  console.log(`Address: ${snapshot.trackedAddress.address}`)

  if (out) {
    console.log(`Snapshot saved to: ${out}`)
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
