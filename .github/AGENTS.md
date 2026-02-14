---
description: GitHub Copilot coding agent for ECNS App - React/Next.js transaction flows and blockchain integration specialist
---

# ECNS App Coding Agent

**Role:** React/Next.js developer specializing in transaction flows, blockchain integration, and component architecture for ECNS (Ethereum Classic Name Service).

**Tech Stack:** Next.js 16, React 19, TypeScript 5.7, viem 2.19.4, wagmi 2.12.4, styled-components 6.1.13

---

## Executable Commands (Run First)

```bash
# Development
pnpm dev                    # Start dev server (localhost:3000)
pnpm dev:mordor             # Dev with Mordor testnet (chain 63)
pnpm dev:etc                # Dev with ETC mainnet (chain 61)

# Validation (run before commits)
pnpm lint:types             # TypeScript typecheck
pnpm lint                   # ESLint + Stylelint
pnpm test                   # Vitest unit tests
pnpm build                  # Production build

# Testing
pnpm test:watch             # Vitest watch mode
pnpm test:coverage          # Coverage + typecheck
pnpm e2e                    # Playwright E2E (stateless)
pnpm e2e:stateful           # Playwright E2E (stateful)

# Local blockchain
pnpm denv                   # Start test environment (Docker)
pnpm dev:glocal             # Dev with local blockchain
```

---

## Transaction Flow Pattern (CRITICAL)

**All blockchain operations follow this 4-step pattern:**

### Pattern: `input → intro → transaction → completed`

```typescript
// 1. INPUT - Form screen
// File: transaction-flow/input/RegisterName-input.tsx
export const RegisterNameInput = ({ data, dispatch }) => (
  <form onSubmit={() => dispatch({ name: 'setFlowStage', payload: 'intro' })}>
    <Input name="name" placeholder="example.etc" />
    <Button type="submit">Next</Button>
  </form>
)

// 2. INTRO - Confirmation screen
// File: transaction-flow/intro/RegisterName-intro.tsx
export const RegisterNameIntro = ({ data, dispatch }) => (
  <div>
    <p>Registering {data.name} for 1 year</p>
    <Button onClick={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}>
      Confirm Transaction
    </Button>
  </div>
)

// 3. TRANSACTION - Blockchain execution
// File: transaction-flow/transaction/registerName.ts
export const registerName: TransactionItem = {
  name: 'registerName',
  action: async ({ name, duration }, connectedChain, account) => {
    const controller = getContract(ETCRegistrarController)
    const request = await controller.simulate.register([name, duration])
    return sendTransaction(request)
  },
}

// 4. COMPLETED - Auto-rendered by TransactionFlowProvider
// Shows success/failure based on transaction result
```

### Triggering Flows

```typescript
import { useTransactionFlow } from '@app/hooks/useTransactionFlow'

const { showDataInput } = useTransactionFlow()

// Trigger registration flow
showDataInput('registerName', 'input', { defaultName: 'example.etc' })

// Trigger profile update flow
showDataInput('updateProfile', 'input', { name: 'example.etc' })
```

---

## Component Architecture (CRITICAL)

### @atoms/ - UI Primitives
**No business logic. Props only.**

```typescript
// @atoms/Button.tsx
export const Button = ({ children, onClick, disabled }) => (
  <StyledButton onClick={onClick} disabled={disabled}>
    {children}
  </StyledButton>
)

// @atoms/Input.tsx
export const Input = ({ value, onChange, placeholder }) => (
  <StyledInput value={value} onChange={onChange} placeholder={placeholder} />
)
```

### @molecules/ - Composite Components
**Light logic allowed. Still reusable.**

```typescript
// @molecules/SearchInput.tsx
export const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState('')
  return (
    <Container>
      <Input value={value} onChange={setValue} placeholder="Search names..." />
      <Button onClick={() => onSearch(value)}>
        <SearchIcon />
      </Button>
    </Container>
  )
}

// @molecules/TransactionDialog.tsx
export const TransactionDialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null
  return (
    <Modal onClose={onClose}>
      <DialogContent>{children}</DialogContent>
    </Modal>
  )
}
```

### pages/ - Route Files
**Keep minimal. Delegate to components/pages/.**

```typescript
// pages/register.tsx
import { RegisterPage } from '@app/components/pages/register/RegisterPage'

export default function Register() {
  return <RegisterPage />
}
```

### components/pages/ - Page Logic
**Organize by route. Contains page-specific logic.**

```typescript
// components/pages/register/RegisterPage.tsx
export const RegisterPage = () => {
  const { showDataInput } = useTransactionFlow()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: availability } = useQuery({
    queryKey: ['availability', searchTerm],
    queryFn: () => checkAvailability(searchTerm),
    enabled: !!searchTerm,
  })

  return (
    <Container>
      <SearchInput onSearch={setSearchTerm} />
      {availability?.available && (
        <Button onClick={() => showDataInput('registerName', 'input', { name: searchTerm })}>
          Register {searchTerm}
        </Button>
      )}
    </Container>
  )
}
```

---

## Blockchain Integration

### viem + wagmi Pattern

```typescript
import { useAccount, useContractRead, useContractWrite } from 'wagmi'
import { getContract } from 'viem'

// Read contract data
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

### ENS.js (ECNS.js) Integration

```typescript
import { useEnsjs } from '@app/hooks/useEnsjs'

const { client } = useEnsjs()

// Get name data
const name = await client.getName({ address })
const profile = await client.getProfile({ name: 'example.etc' })

// Update records
await client.setRecords({
  name: 'example.etc',
  records: {
    texts: [{ key: 'avatar', value: 'https://...' }],
    addresses: [{ coinType: 61, address: '0x...' }],
  },
})
```

---

## Path Aliases (CRITICAL)

**Always use aliases. Never relative paths.**

```typescript
// ✅ CORRECT
import { Button } from '@app/@atoms/Button'
import { SearchInput } from '@app/@molecules/SearchInput'
import { useTransactionFlow } from '@app/hooks/useTransactionFlow'
import Logo from '@public/logo.svg'

// ❌ WRONG
import { Button } from '../../../@atoms/Button'
import { SearchInput } from '../../@molecules/SearchInput'
```

| Alias | Maps To | Usage |
|-------|---------|-------|
| `@app/*` | `src/*` | All source files |
| `@public/*` | `public/*` | Static assets |
| `@root/*` | `./*` | Config files |

---

## Styling with styled-components

### Pattern: Colocation

```typescript
// components/pages/register/RegisterPage.tsx
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  color: ${(p) => p.theme.colors.primary};
`

export const RegisterPage = () => (
  <Container>
    <Title>Register a Name</Title>
  </Container>
)
```

### Thorin Design System

```typescript
import { Button, Input, Typography } from '@ensdomains/thorin'

export const FormComponent = () => (
  <>
    <Typography variant="headingTwo">Register</Typography>
    <Input placeholder="example.etc" />
    <Button colorStyle="accentPrimary">Submit</Button>
  </>
)
```

---

## Testing Patterns

### Vitest Unit Tests

```typescript
// src/hooks/useName.test.ts
import { renderHook, waitFor } from '@testing-library/react-hooks'
import { useName } from './useName'

describe('useName', () => {
  it('should fetch name data', async () => {
    const { result } = renderHook(() => useName('example.etc'))
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data.owner).toBe('0x...')
  })
})
```

### Playwright E2E Tests

```typescript
// e2e/register.spec.ts
import { test, expect } from '@playwright/test'
import { makeName } from './fixtures/makeName'

test('should register a name', async ({ page }) => {
  const name = makeName('test')  // Creates unique name: test-1234567890.etc

  await page.goto('/register')
  await page.fill('input[placeholder*="Search"]', name)
  await page.click('button:has-text("Register")')

  // Wait for transaction flow
  await expect(page.locator('text=Confirm Transaction')).toBeVisible()
  await page.click('button:has-text("Confirm Transaction")')

  // Wait for completion
  await expect(page.locator('text=Registration successful')).toBeVisible({ timeout: 30000 })
})
```

**CRITICAL:** Always use `makeName()` helper for E2E tests to create unique names.

---

## Mordor Testnet Contracts (Chain 63)

```typescript
export const MORDOR_CONTRACTS = {
  ECNSRegistry: '0x29dd3a41973ec0551bcd195e46e8eb9801621c34',
  ETCRegistrarController: '0x6d36c84926c2637448f2a7eabad3a0eed7f95b25',
  PublicResolver: '0xc1267bafafd08fe85580985b020b2df08d863ca4',
  BaseRegistrar: '0xfbce90395535d6ae9448f55d676bde9a40215a37',
  ReverseRegistrar: '0x0ebc22b513866796157a9fc9e86d23c3cddc28ab',
}
```

**ETC Mainnet (Chain 61):** Contracts TBD.

---

## Three-Tier Boundaries

### ALWAYS DO
- Use path aliases (`@app/`, `@public/`, `@root/`)
- Follow transaction flow pattern (input → intro → transaction → completed)
- Run `pnpm lint:types` before committing
- Use TypeScript strict mode (no `any` types)
- Test on Mordor before ETC mainnet
- Use `makeName()` for E2E tests
- Keep page components minimal
- Colocate styles with components

### ASK FIRST
- Modifying `TransactionFlowProvider`
- Changing contract addresses
- Adding new transaction flow types
- Modifying global styles or theme
- Changing Next.js config

### NEVER DO
- Use relative imports (always use path aliases)
- Use `any` type in TypeScript
- Bypass transaction flow system
- Commit `.env` files or private keys
- Deploy to production without Mordor testing
- Push directly to main branch (use feature branches)

---

## Code Style Examples

### Transaction Flow File

```typescript
// transaction-flow/transaction/updateProfile.ts
import type { TransactionItem } from '@app/types'
import { getContract } from 'viem'
import { PUBLIC_RESOLVER_ABI } from '@app/constants/abis'

export const updateProfile: TransactionItem = {
  name: 'updateProfile',
  action: async ({ name, records }, connectedChain, account) => {
    const resolver = getContract({
      address: PUBLIC_RESOLVER,
      abi: PUBLIC_RESOLVER_ABI,
    })

    // Batch record updates
    const requests = records.map((record) =>
      resolver.simulate.setText([namehash(name), record.key, record.value])
    )

    return sendTransaction(requests)
  },
}
```

### Hook Pattern

```typescript
// hooks/ensjs/useName.ts
import { useQuery } from '@tanstack/react-query'
import { useEnsjs } from './useEnsjs'

export const useName = (nameOrAddress: string) => {
  const { client } = useEnsjs()

  return useQuery({
    queryKey: ['name', nameOrAddress],
    queryFn: async () => {
      if (nameOrAddress.startsWith('0x')) {
        return client.getName({ address: nameOrAddress })
      }
      return client.getProfile({ name: nameOrAddress })
    },
    enabled: !!nameOrAddress,
  })
}
```

### Component with Data Fetching

```typescript
// components/pages/profile/ProfilePage.tsx
import { useName } from '@app/hooks/ensjs/useName'
import { useTransactionFlow } from '@app/hooks/useTransactionFlow'
import { Button } from '@app/@atoms/Button'
import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`

export const ProfilePage = ({ name }: { name: string }) => {
  const { data: profile, isLoading } = useName(name)
  const { showDataInput } = useTransactionFlow()

  if (isLoading) return <div>Loading...</div>

  return (
    <Container>
      <h1>{name}</h1>
      <p>Owner: {profile.owner}</p>
      <Button
        onClick={() => showDataInput('updateProfile', 'input', { name })}
      >
        Edit Profile
      </Button>
    </Container>
  )
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

## Tech Stack Reference

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 24.x |
| Framework | Next.js | 16.x |
| UI | React | 19.x |
| Language | TypeScript | 5.7 |
| Blockchain | viem | 2.19.4 |
| Blockchain | wagmi | 2.12.4 |
| State | @tanstack/react-query | 5.22.2 |
| Styling | styled-components | 6.1.13 |
| Design | @ensdomains/thorin | 1.0.0-beta.28 |
| Testing | Vitest | 3.x |
| E2E | Playwright | 1.50.1 |
| Package Manager | pnpm | 10.23.0 |
