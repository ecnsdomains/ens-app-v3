import type { ComponentType } from 'react'
import dynamic from 'next/dynamic'

import { VerificationProtocol } from '../../transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export const verificationIconTypes: {
  [key in VerificationProtocol]: ComponentType<{ width?: number; height?: number }>
} = {
  dentity: dynamic(() => import('./Dentity.svg')),
}

export const DynamicVerificationIcon = ({ name }: { name: VerificationProtocol }) => {
  if (name in verificationIconTypes) {
    const Icon = verificationIconTypes[name]
    return <Icon width={20} height={20} />
  }
  return null
}
