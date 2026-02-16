# GitHub Copilot Instructions - ECNS App

**Self-contained instructions for GitHub Copilot. Does NOT reference external files.**

---

## Project Overview

ECNS App - Frontend for Ethereum Classic Name Service (`.etc` domains). Built with Next.js 16, React 19, TypeScript 5.7, viem 2.19.4, wagmi 2.12.4.

**Repository:** https://github.com/ecnsdomains/ens-app-v3
**Networks:** ETC mainnet (chain 61), Mordor testnet (chain 63)

---

## LTS Versions (CRITICAL)

**Last Updated:** 2026-02-12

### Current Stable Versions

| Technology | Version | Notes |
|------------|---------|-------|
| Node.js | 24.x | Active LTS |
| npm | 11.x | Ships with Node 24 |
| pnpm | 10.x | Fast, disk-efficient |
| Next.js | 16.x | App Router |
| React | 19.x | Server Components |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | 4.x | CSS-first |
| Vitest | 3.x | Vite-native |
| Playwright | 1.x | E2E testing |

### DEPRECATED - DO NOT USE

| Technology | Version | Status | EOL |
|------------|---------|--------|-----|
| Node.js | 22.x | Security-only | Apr 2027 |
| Node.js | 20.x | Security-only | Apr 2026 |
| Next.js | 15.x | Security-only | Oct 2026 |
| Next.js | 14.x | EOL | Oct 2025 |
| React | 18.x | Maintenance | Migrate to 19.x |

**Always use current LTS versions. Never suggest deprecated versions.**

---

## Tech Stack

### Core
- **Runtime:** Node.js 24.x
- **Framework:** Next.js 16.x (App Router)
- **UI:** React 19.x (Server Components)
- **Language:** TypeScript 5.7 (strict mode)
- **Package Manager:** pnpm 10.23.0

### Blockchain
- **viem:** 2.19.4 (Ethereum interaction)
- **wagmi:** 2.12.4 (React hooks)
- **@tanstack/react-query:** 5.22.2 (data fetching/caching)
- **@ensdomains/ensjs:** deab43b (ENS SDK, custom build)

### Styling & UI
- **styled-components:** 6.1.13 (CSS-in-JS)
- **@ensdomains/thorin:** 1.0.0-beta.28 (design system)
- **react-hook-form:** 7.51.0 (form management)

### Testing
- **Vitest:** 3.x (unit/integration tests)
- **Playwright:** 1.50.1 (E2E tests)
- **@testing-library/react:** 16.2.0 (component testing)

---

## Commands

### Development
```bash
pnpm install                # Install dependencies
pnpm dev                    # Dev server (localhost:3000)
pnpm dev:mordor             # Dev with Mordor testnet
pnpm dev:etc                # Dev with ETC mainnet
pnpm build                  # Production build
pnpm start                  # Production server
```

### Testing
```bash
pnpm test                   # Unit tests (Vitest)
pnpm test:watch             # Watch mode
pnpm test:coverage          # Coverage + typecheck
pnpm e2e                    # E2E tests (stateless)
pnpm e2e:stateful           # E2E tests (stateful)
```

### Validation
```bash
pnpm lint                   # ESLint + Stylelint
pnpm lint:types             # TypeScript typecheck
pnpm lint:fix               # Auto-fix issues
```

---

## Architecture

### Directory Structure

```
src/
├── @atoms/              # Reusable UI primitives
├── @molecules/          # Composite components
├── components/
│   └── pages/           # Page-specific components
├── pages/               # Next.js routes (minimal)
├── transaction-flow/    # Transaction orchestration
│   ├── input/           # Form screens
│   ├── intro/           # Confirmation screens
│   ├── transaction/     # Blockchain execution
│   └── TransactionFlowProvider.tsx
├── hooks/
│   ├── ensjs/           # Blockchain hooks
│   ├── transactions/    # Transaction management
│   └── abilities/       # Permission checks
└── utils/
    ├── query/           # TanStack Query utilities
    ├── analytics/       # Event tracking
    └── validation/      # Form validation
```

### Path Aliases

**Always use aliases. Never relative paths.**

```typescript
// ✅ CORRECT
import { Button } from '@app/@atoms/Button'
import { SearchInput } from '@app/@molecules/SearchInput'
import Logo from '@public/logo.svg'

// ❌ WRONG
import { Button } from '../../../@atoms/Button'
```

| Alias | Maps To |
|-------|---------|
| `@app/*` | `src/*` |
| `@public/*` | `public/*` |
| `@root/*` | `./*` |

---

## Transaction Flow Pattern (CRITICAL)

**All blockchain operations follow: input → intro → transaction → completed**

### 1. Input (Form Screen)

```typescript
// transaction-flow/input/RegisterName-input.tsx
export const RegisterNameInput = ({ data, dispatch }) => (
  <form onSubmit={() => dispatch({ name: 'setFlowStage', payload: 'intro' })}>
    <Input name="name" placeholder="example.etc" />
    <Button type="submit">Next</Button>
  </form>
)
```

### 2. Intro (Confirmation Screen)

```typescript
// transaction-flow/intro/RegisterName-intro.tsx
export const RegisterNameIntro = ({ data, dispatch }) => (
  <div>
    <p>Registering {data.name} for 1 year</p>
    <Button onClick={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}>
      Confirm Transaction
    </Button>
  </div>
)
```

### 3. Transaction (Blockchain Execution)

```typescript
// transaction-flow/transaction/registerName.ts
export const registerName: TransactionItem = {
  name: 'registerName',
  action: async ({ name, duration }, connectedChain, account) => {
    const controller = getContract(ETCRegistrarController)
    const request = await controller.simulate.register([name, duration])
    return sendTransaction(request)
  },
}
```

### 4. Completed
Auto-rendered by `TransactionFlowProvider` based on result.

### Triggering Flows

```typescript
import { useTransactionFlow } from '@app/hooks/useTransactionFlow'

const { showDataInput } = useTransactionFlow()
showDataInput('registerName', 'input', { defaultName: 'example.etc' })
```

---

## Component Patterns

### @atoms/ - UI Primitives
No business logic. Props only.

```typescript
// @atoms/Button.tsx
export const Button = ({ children, onClick, disabled }) => (
  <StyledButton onClick={onClick} disabled={disabled}>
    {children}
  </StyledButton>
)
```

### @molecules/ - Composite Components
Light logic allowed. Still reusable.

```typescript
// @molecules/SearchInput.tsx
export const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState('')
  return (
    <Container>
      <Input value={value} onChange={setValue} />
      <Button onClick={() => onSearch(value)}>Search</Button>
    </Container>
  )
}
```

### pages/ - Route Files
Keep minimal. Delegate to `components/pages/`.

```typescript
// pages/register.tsx
import { RegisterPage } from '@app/components/pages/register/RegisterPage'

export default function Register() {
  return <RegisterPage />
}
```

### components/pages/ - Page Logic
Organize by route. Contains page-specific logic.

```typescript
// components/pages/register/RegisterPage.tsx
export const RegisterPage = () => {
  const { showDataInput } = useTransactionFlow()

  return (
    <Container>
      <SearchInput onSearch={(name) => showDataInput('registerName', 'input', { name })} />
    </Container>
  )
}
```

---

## Blockchain Integration

### viem + wagmi

```typescript
import { useContractRead, useContractWrite } from 'wagmi'

// Read contract
const { data: owner } = useContractRead({
  address: ECNS_REGISTRY,
  abi: ECNSRegistryABI,
  functionName: 'owner',
  args: [namehash('example.etc')],
})

// Write to contract
const { writeAsync } = useContractWrite({
  address: ECNS_REGISTRY,
  abi: ECNSRegistryABI,
  functionName: 'setOwner',
})

await writeAsync({ args: [namehash('example.etc'), newOwner] })
```

### ENS.js (ECNS.js)

```typescript
import { useEnsjs } from '@app/hooks/useEnsjs'

const { client } = useEnsjs()
const name = await client.getName({ address })
const profile = await client.getProfile({ name: 'example.etc' })
```

---

## Styling (styled-components)

```typescript
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  gap: 1rem;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  color: ${(p) => p.theme.colors.primary};
`

export const Component = () => (
  <Container>
    <Title>Hello</Title>
  </Container>
)
```

---

## Testing

### Vitest Unit Tests

```typescript
// src/hooks/useName.test.ts
import { renderHook, waitFor } from '@testing-library/react-hooks'
import { useName } from './useName'

it('should fetch name data', async () => {
  const { result } = renderHook(() => useName('example.etc'))
  await waitFor(() => expect(result.current.data).toBeDefined())
  expect(result.current.data.owner).toBe('0x...')
})
```

### Playwright E2E Tests

```typescript
// e2e/register.spec.ts
import { test, expect } from '@playwright/test'
import { makeName } from './fixtures/makeName'

test('should register a name', async ({ page }) => {
  const name = makeName('test')  // Creates unique name
  await page.goto('/register')
  await page.fill('input[placeholder*="Search"]', name)
  await page.click('button:has-text("Register")')
  await expect(page.locator('text=Registration successful')).toBeVisible()
})
```

**Always use `makeName()` for E2E tests.**

---

## Mordor Testnet Contracts (Chain 63)

```typescript
export const MORDOR_CONTRACTS = {
  ECNSRegistry: '0x298195a795a5fe91bb47db1c4e501f07767775c8',
  BaseRegistrar: '0x828efe05d833bd3e10a3086cf2df1c49bad0082f',
  ETCRegistrarController: '0x3daccff9a51a04ac01a09ba78919874536b34309',
  PublicResolver: '0xa2d0c9a23729811607e09487cdd98dbb43e55f71',
  ReverseRegistrar: '0xab9ffcf5ccaaf0f276a7c9813d57a8418e7e9f6a',
}
```

---

## Protected Files

**Do not modify without explicit request:**

- `next.config.js`
- `tsconfig.json`
- `src/transaction-flow/TransactionFlowProvider.tsx`
- `src/utils/chains.ts`
- `playwright.config.ts`
- `vitest.config.ts`

---

## Key Rules

### Always Do
- Use path aliases (`@app/`, `@public/`, `@root/`)
- Follow transaction flow pattern (input → intro → transaction → completed)
- Run `pnpm lint:types` before committing
- Use TypeScript strict mode (no `any` types)
- Test on Mordor before ETC mainnet
- Keep page components minimal

### Never Do
- Use relative imports (always use path aliases)
- Use `any` type in TypeScript
- Bypass transaction flow system
- Commit `.env` files or private keys
- Deploy without Mordor testing
- Push directly to main (use feature branches)

---

## Git Workflow (CRITICAL)

### NEVER push directly to main branch
- Always work on feature branches
- Create pull requests for all changes
- Use `git push origin <branch-name>` for feature branches only
- If on main, switch to feature branch before making changes

### Commit Checklist
```bash
# 1. Verify gitignore coverage
git status

# 2. Run validation
pnpm lint:types && pnpm lint && pnpm test

# 3. Stage specific files (never git add -A)
git add <specific-files>

# 4. Commit with descriptive message
git commit -m "description of why"
```

---

## Security (CRITICAL)

### Must Be Gitignored

**Never commit these:**

```gitignore
# Secrets
.env
.env.*
!.env.example
*.pem
*.key
credentials.json

# Internal docs
SESSION_NOTES.md
PLANNING.md
SCRATCH.md
*.scratch.*
*.draft.*

# Blockchain
keystore/
*.keystore
wallet.json
mnemonic.txt

# IDE
.vscode/settings.json
.idea/
```

### Safe to Commit

- `.claude/CLAUDE.md`
- `.github/AGENTS.md`
- `.github/copilot-instructions.md`
- `.env.example`

---

## Validation Before Commit

```bash
pnpm lint:types        # TypeScript typecheck
pnpm lint              # ESLint + Stylelint
pnpm test              # Unit tests
pnpm build             # Production build
```
