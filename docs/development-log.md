# Development Log

Track of what's been built and learned in this repo.

## 2026-03

### Week 4

- **Restructured the repo** — moved from a single README dump to organized journal entries with proper markdown formatting
- **Set up project structure** — `journal/`, `resources/`, `docs/` directories for different types of content
- **Documented 5 days of Base research** — covering fundamentals, distribution advantages, UX approach, Superchain independence, and current metrics

- **Added getting-started guide** — curated dev tools, network configs, faucet links, and a suggested learning path in `resources/`
- **Built chain info script** — zero-dependency Node.js script that queries Base mainnet RPC for block stats, gas price, and bridge balance

### Next Up

- [ ] Set up a Base Sepolia testnet wallet and document the process
- [ ] Write a simple Solidity contract and deploy to Base Sepolia
- [ ] Add a contract interaction script that reads on-chain state
- [ ] Compare Base dev experience to Arbitrum/Optimism

## 2026-04

### Week 2

- **Added signer-indexed guestbook queries** — contract now tracks entry indexes per signer and exposes `getEntryIndexesBySigner` plus `getRecentEntriesBySigner`.
- **Expanded test coverage** — added tests for signer index ordering and signer-scoped recent entry retrieval.
- **Improved telemetry script output** — added JSON output mode plus snapshot file export for historical tracking.
- **Added CI baseline** — GitHub Actions workflow now runs `forge build` and `forge test` on push/PR.
