import { useAppKit, useAppKitState } from '@reown/appkit/react'

/**
 * Compatibility hook that wraps Reown AppKit to provide the same API
 * as the old RainbowKit useConnectModal hook.
 */
export function useConnectModal() {
  const appKit = useAppKit()
  const state = useAppKitState()

  return {
    openConnectModal: () => appKit.open({ view: 'Connect' }),
    connectModalOpen: state.open,
  }
}
