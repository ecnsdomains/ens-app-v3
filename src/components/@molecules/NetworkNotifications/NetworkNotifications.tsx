import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount, useChainId } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { getSupportedChainById } from '@app/constants/chains'

import { shouldOpenModal } from './utils'

// Chain ID to app URL mapping
const APP_LINKS_BY_CHAIN_ID = new Map<number, string>([
  [1, 'app.ens.domains'], // Ethereum
  [11155111, 'sepolia.app.ens.domains'], // Sepolia
  [1337, ''], // Localhost
  [63, 'app.ecns.domains'], // Mordor (ECNS testnet)
  [61, 'app.ecns.domains'], // ETC (ECNS mainnet)
])

const getAppLink = (chainId: number | undefined): string => {
  if (!chainId) return ''
  return APP_LINKS_BY_CHAIN_ID.get(chainId) || ''
}

export const NetworkNotifications = () => {
  const { t } = useTranslation()
  const account = useAccount()
  const connectedChainId = useChainId()
  const [open, setOpen] = useState<boolean>(false)

  const accountChainId = account?.chainId

  useEffect(() => {
    setOpen(shouldOpenModal(connectedChainId, accountChainId))
  }, [connectedChainId, accountChainId])

  const accountChainName = getSupportedChainById(accountChainId)?.name
  const appLink = getAppLink(accountChainId)

  if (!accountChainName) return null

  return (
    <Toast
      description={t(`networkNotifications.${accountChainName}.description`)}
      open={open}
      title={t(`networkNotifications.${accountChainName}.title`)}
      variant="desktop"
      onClose={() => setOpen(false)}
    >
      <Button size="small" as="a" href={`https://${appLink}`}>
        {t(`networkNotifications.${accountChainName}.action`)}
      </Button>
    </Toast>
  )
}
