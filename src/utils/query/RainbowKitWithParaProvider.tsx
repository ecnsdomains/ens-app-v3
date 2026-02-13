import { lightTheme, RainbowKitProvider, Theme } from '@getpara/rainbowkit'
import { ComponentProps, useEffect, useState } from 'react'

import { lightTheme as thorinLightTheme } from '@ensdomains/thorin'

import { loadPara } from './loadPara'

type RainbowKitProviderProps = ComponentProps<typeof RainbowKitProvider>

// ECNS Green accent color
const ECNS_GREEN = '#3FB68B'

const rainbowKitTheme: Theme = {
  ...lightTheme({
    accentColor: ECNS_GREEN,
    borderRadius: 'medium',
  }),
  fonts: {
    body: 'IBM Plex Mono, SF Mono, Fira Code, Fira Mono, Consolas, Liberation Mono, monospace',
  },
}

export const RainbowKitWithParaProvider = (props: RainbowKitProviderProps) => {
  const [paraData, setPara] = useState<Awaited<ReturnType<typeof loadPara>> | null>(null)

  // Dynamically load para
  useEffect(() => {
    loadPara().then(setPara)
  }, [])

  return (
    <RainbowKitProvider
      theme={rainbowKitTheme}
      {...props}
      para={paraData?.paraClient}
      paraIntegratedProps={paraData?.paraModalProps}
    />
  )
}
