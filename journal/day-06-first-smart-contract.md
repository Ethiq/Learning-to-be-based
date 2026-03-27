# Day 6 — Writing My First Smart Contract for Base

## The Goal

Write something simple enough to deploy to Base Sepolia as a first experiment. Not a token, not a DeFi protocol — just something interactive that proves I can get code on-chain.

## Why a Guestbook?

A guestbook is the "Hello World" of smart contracts that actually does something:

- It stores state on-chain (messages)
- It handles user input (signing)
- It emits events (for off-chain indexing)
- It has view functions (for reading without gas)

It's simple enough to understand completely but complex enough to touch the key Solidity concepts: structs, arrays, events, `calldata` vs `memory`, and input validation.

## What I Learned Writing It

### Storage is expensive
Every `Entry` struct gets written to storage, which is the most expensive operation in the EVM. On Ethereum mainnet this would cost dollars per entry. On Base, it's fractions of a cent — which is exactly why L2s matter for consumer apps.

### `calldata` vs `memory` for strings
Using `calldata` for the function parameter is cheaper than `memory` because it avoids copying the data. For view functions that return strings, you have to use `memory` since the data comes from storage.

### Events are for off-chain consumers
The `Signed` event doesn't change contract state — it just creates a log entry that frontends and indexers can listen to. This is the standard pattern for making contracts observable without polling.

### Input validation is minimal
In Solidity you validate at the boundaries and keep it tight. Two `require` checks (not empty, not too long) is enough. No need for elaborate error handling frameworks.

## Tooling Choice: Foundry

Went with Foundry over Hardhat because:

- Faster compilation (Rust-based)
- Tests are written in Solidity (same language as contracts)
- Built-in fuzzing
- `forge script` makes deployment straightforward

The config is minimal — just point it at the contracts directory and set the RPC endpoints.

## Next Steps

- [ ] Write a Foundry test for the Guestbook contract
- [ ] Deploy to Base Sepolia using `forge create`
- [ ] Write a script to interact with the deployed contract
- [ ] Document the deployment process

---

**Previous:** [Day 5 — Base by the Numbers](day-05-base-by-the-numbers.md)
