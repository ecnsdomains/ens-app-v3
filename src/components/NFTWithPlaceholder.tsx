import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { isCurrentTldName } from '@app/constants/tld'
import { useEnsAvatar } from '@app/hooks/useEnsAvatar'

import NFTTemplate from './@molecules/NFTTemplate/NFTTemplate'

const StyledNftBox = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    border-radius: ${theme.radii.large};
    overflow: hidden;
  `,
)

export const NFTWithPlaceholder = ({
  name,
  ...props
}: {
  name: string
} & Omit<ComponentProps<'div'>, 'ref'>) => {
  const { data: avatar } = useEnsAvatar({ name })

  const isCompatible = !!(name && name.split('.').length === 2 && isCurrentTldName(name))

  if (!isCompatible) return null

  return (
    <StyledNftBox {...props}>
      <NFTTemplate name={name} backgroundImage={avatar} isNormalised />
    </StyledNftBox>
  )
}
