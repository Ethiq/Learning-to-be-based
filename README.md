# Base Wallet Analytics Dashboard

A production-style analytics web app for **Base blockchain wallets** inspired by LayerHub-style wallet intelligence tools.

## Problem

Most wallet dashboards are either multi-chain and noisy, or narrowly focused on balances without actionable behavior metrics.
For Base builders and analysts, that makes it hard to quickly answer:

- How active is this wallet really?
- Is usage consistent over time or one-off?
- How deeply does this wallet interact with contracts?
- Where does this wallet rank relative to high-activity users?

## Solution

This repository now provides a **Base-only full-stack analytics platform** with:

- Wallet address search (no wallet connection required)
- Wallet analytics API powered by Base RPC + optional BaseScan enrichment
- Activity trend visualizations
- Ranking score + tier model (Top 1%, Top 10%, etc.)
- Dedicated Base network stats page
- Reusable CLI script for wallet analytics collection

## Stack

- **Frontend:** Next.js App Router + Tailwind CSS + shadcn-style UI primitives
- **Backend:** Next.js API routes (`/api/wallet/[address]`, `/api/network/stats`)
- **Data:** Base RPC + BaseScan API (optional key)
- **State:** React Query
- **Charts:** Recharts

## Core Features

1. **Wallet Search** with client-side address validation
2. **Wallet Analytics Dashboard**
   - Total transactions
   - Active days
   - First/last activity
   - Contracts interacted
   - Contracts created
   - ETH balance
   - Total volume (when tx history available)
3. **Activity Breakdown**
   - Transactions-over-time chart
   - Contract interaction leaderboard
4. **Ranking Engine**
   - Score based on transactions, active days, contract interactions
   - Tier assignment (Top 1%, Top 10%, Top 25%, Top 50%, Emerging)
5. **Base Network Stats Page**
   - Total transactions
   - Active wallets
   - Daily activity chart
6. **CLI Integration**
   - `scripts/base-wallet-analytics.js`

## Project Structure

```text
app/
  api/
    wallet/[address]/route.ts
    network/stats/route.ts
  wallet/[address]/page.tsx
  network/page.tsx
  page.tsx
components/
  dashboard/
  ui/
lib/
  analytics.ts
  ranking.ts
  providers/
scripts/
  base-wallet-analytics.js
  base-chain-info.js
contracts/
test/
```

## Usage

### 1) Install dependencies

```bash
npm install
```

### 2) Environment variables

Create `.env.local`:

```bash
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_key_optional
```

### 3) Run web app

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4) CLI wallet analytics

```bash
node scripts/base-wallet-analytics.js 0xYourWalletAddress --json
```

## Additional Commands

```bash
npm run build
npm run lint
forge test
```

## Quality Notes

- API routes return user-friendly errors for invalid addresses and upstream failures.
- Wallet metrics fall back gracefully when BaseScan API key is absent.
- Foundry CI is included for contract build/test automation.
