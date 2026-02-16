import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAccount, useChainId } from 'wagmi'

import { Button, Toast } from '@ensdomains/thorin'

import { getSupportedChainById } from '@app/constants/chains'

import { shouldOpenModal } from './utils'

// ECNS chain ID to app URL mapping
const APP_LINKS_BY_CHAIN_ID = new Map<number, string>([
  [63, 'mordor.app.ecns.domains'], // Mordor testnet
  [61, 'app.ecns.domains'], // ETC mainnet
])

const getAppLink = (chainId: number | undefined): string => {
  if (!chainId) return ''
  return APP_LINKS_BY_CHAIN_ID.get(chainId) || ''
}

const ECNSToastWrapper = styled.div`
  [data-testid='toast-desktop'] {
    background-color: #0f1f18 !important;
    border: 1px solid #1a4e39 !important;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5) !important;
  }

  [data-testid='toast-desktop'] > div:first-of-type {
    color: #3fb68b !important;
  }

  [data-testid='toast-desktop'] h4,
  [data-testid='toast-desktop'] [font-variant='headingFour'] {
    color: #3fb68b !important;
  }

  [data-testid='toast-desktop'] p,
  [data-testid='toast-desktop'] span {
    color: #a0b8ac !important;
  }

  [data-testid='toast-close-icon'] {
    color: #3fb68b !important;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  [data-testid='toast-desktop'] a {
    background-color: #1a4e39 !important;
    color: #3fb68b !important;
    border: 1px solid #2a7052 !important;
    transition: background-color 150ms ease !important;

    &:hover {
      background-color: #246548 !important;
    }
  }
`

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
    <ECNSToastWrapper>
      <Toast
        description={t(`networkNotifications.${accountChainName}.description`)}
        open={open}
        title={t(`networkNotifications.${accountChainName}.title`)}
        variant="desktop"
        onClose={() => setOpen(false)}
      >
        {appLink && (
          <Button size="small" as="a" href={`https://${appLink}`}>
            {t(`networkNotifications.${accountChainName}.action`)}
          </Button>
        )}
      </Toast>
    </ECNSToastWrapper>
  )
}
