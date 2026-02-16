import { useConnection } from 'wagmi'

import { Card, Typography } from '@ensdomains/thorin'

import RecordItem from '@app/components/RecordItem'

export const WalletSection = () => {
  const { address, connector } = useConnection()

  return (
    <Card>
      <Typography
        display="flex"
        fontVariant="headingFour"
        justifyContent="space-between"
        alignItems="center"
      >
        Wallet{' '}
      </Typography>
      <RecordItem type="address" itemKey="Address" value={address as string} />
      <RecordItem type="text" itemKey="Connector" value={connector?.name as string} />
    </Card>
  )
}
