# Contributing

Thanks for contributing to this repository.

## Goals

Keep this project useful as both a learning record and a developer portfolio artifact. Changes should improve either:

1. Technical depth (contracts/tests/scripts), or
2. Clarity (docs, reproducibility, structure).

## Commit Quality Standards

Avoid vague commit messages such as:

- `update`
- `fix`
- `minor`
- `changes`

Prefer actionable, developer-style messages:

- `docs(readme): add problem-solution-usage sections`
- `feat(script): add rpc/address flags to chain inspector`
- `test(guestbook): cover event emission and empty message revert`

### Suggested format

Use a Conventional Commits–style prefix:

- `feat:` new behavior
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` internal code change without behavior changes
- `test:` tests only
- `chore:` maintenance tasks

## Pull Request Checklist

- [ ] Scope is small and coherent
- [ ] Commit messages explain *why* and *what*
- [ ] README/docs updated if behavior changed
- [ ] Commands to reproduce are included
- [ ] Tests pass locally (`forge test`)

## Development Commands

```bash
forge build
forge test
node scripts/base-chain-info.js
```
