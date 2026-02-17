import { createAppKit } from '@reown/appkit/react'

import { appKitNetworks, projectId, wagmiAdapter } from './wagmi'

// Initialize Reown AppKit — wallet modal with social login, email, and standard wallets
// This module is dynamically imported (see AppKitInitializer) to defer the heavy
// @reown/appkit/react bundle (~13MB of Lit web components) from the critical path.
createAppKit({
  adapters: [wagmiAdapter],
  networks: appKitNetworks,
  projectId,
  metadata: {
    name: 'ECNS',
    description: 'Ethereum Classic Name Service',
    url: 'https://ecns.domains',
    icons: ['https://ecns.domains/icon.png'],
  },
  features: {
    email: true,
    socials: ['google', 'discord', 'apple', 'github', 'farcaster'],
    emailShowWallets: true,
    // Disable unused wallet features — reduces AppKit background API calls on ETC/Mordor
    swaps: false,
    onramp: false,
    send: false,
    history: false,
    analytics: false,
  },
  themeMode: 'dark',
  themeVariables: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '--w3m-accent': '#3FB68B',
  },
})
