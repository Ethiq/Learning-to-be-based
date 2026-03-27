# Getting Started Building on Base

A curated collection of resources for developers who want to build on Base. Not a link dump — these are the tools and references I've actually found useful.

## Official Resources

| Resource | What It's For |
|----------|---------------|
| [Base Docs](https://docs.base.org) | Official documentation — start here |
| [Base Camp](https://docs.base.org/base-camp/docs/welcome) | Free guided course for learning to build on Base |
| [Basescan](https://basescan.org) | Block explorer for Base mainnet |
| [Base Sepolia Basescan](https://sepolia.basescan.org) | Block explorer for the testnet |

## Network Details

### Base Mainnet

| Property | Value |
|----------|-------|
| Network Name | Base |
| Chain ID | `8453` |
| Currency | ETH |
| RPC URL | `https://mainnet.base.org` |
| Block Explorer | `https://basescan.org` |

### Base Sepolia (Testnet)

| Property | Value |
|----------|-------|
| Network Name | Base Sepolia |
| Chain ID | `84532` |
| Currency | ETH |
| RPC URL | `https://sepolia.base.org` |
| Block Explorer | `https://sepolia.basescan.org` |

## Getting Testnet ETH

You need Sepolia ETH to deploy contracts on the testnet.

- [Coinbase Faucet](https://portal.cdp.coinbase.com/products/faucet) — requires Coinbase account, most reliable
- [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia) — requires Alchemy account
- [QuickNode Faucet](https://faucet.quicknode.com/base/sepolia) — alternative option

## Developer Tools

### Smart Contracts

- **[Hardhat](https://hardhat.org)** — most popular Solidity dev environment, great plugin ecosystem
- **[Foundry](https://book.getfoundry.sh)** — fast Solidity toolkit written in Rust, preferred for serious contract development
- **[Remix](https://remix.ethereum.org)** — browser-based IDE, good for quick prototyping

### Frontend / SDK

- **[viem](https://viem.sh)** — TypeScript library for interacting with EVM chains, lightweight and type-safe
- **[wagmi](https://wagmi.sh)** — React hooks for Ethereum, built on viem
- **[OnchainKit](https://onchainkit.xyz)** — Coinbase's React component library for building on Base

### Infrastructure

- **[Alchemy](https://www.alchemy.com)** — RPC provider with Base support and enhanced APIs
- **[QuickNode](https://www.quicknode.com)** — alternative RPC provider
- **[The Graph](https://thegraph.com)** — indexing protocol for querying on-chain data

## Quick Start: Connect to Base with viem

```typescript
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

const client = createPublicClient({
  chain: base,
  transport: http(),
})

// Get the latest block number
const blockNumber = await client.getBlockNumber()
console.log('Latest Base block:', blockNumber)
```

## What to Build First

If you're just getting started, here's a practical progression:

1. **Read chain data** — query block numbers, balances, transaction history
2. **Deploy to testnet** — write a simple Solidity contract and deploy to Base Sepolia
3. **Build a frontend** — connect a React app to your contract using wagmi
4. **Go mainnet** — deploy to Base mainnet (costs real ETH, but fees are tiny)
