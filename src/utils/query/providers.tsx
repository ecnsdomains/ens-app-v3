import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'

// Side-effect import: initializes AppKit before any component uses useAppKit().
// Separated from wagmi.ts to isolate the heavy @reown/appkit/react dependency (~13MB)
// from the wagmi config module, improving Turbopack's incremental compilation.
import './appkit-init'
import { createPersistConfig } from './persist'
import { queryClient } from './reactQuery'
import { wagmiConfig } from './wagmi'

const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((m) => m.ReactQueryDevtools),
  { ssr: false },
)

type Props = {
  children: ReactNode
}

export function QueryProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={typeof window !== 'undefined'}>
      <PersistQueryClientProvider
        client={queryClient}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PersistQueryClientProvider persistOptions type mismatch with OmitKeyof return type
        persistOptions={createPersistConfig({ queryClient }) as any}
      >
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
