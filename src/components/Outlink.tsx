import type { UrlObject } from 'url'

import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { AsProp, Typography, type FontVariant } from '@ensdomains/thorin'

import OutlinkSVG from '@app/assets/Outlink.svg'

import BaseLink from './@atoms/BaseLink'

const outlinkStyles = css`
  padding-right: ${({ theme }) => theme.space['4']};
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.space['1']};
`

export const StyledAnchor = styled.a`
  ${outlinkStyles}
`

const StyledBaseLink = styled(BaseLink)`
  ${outlinkStyles}
`

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    opacity: 0.5;
  `,
)

export const OutlinkTypography = styled(Typography)(
  () => css`
    display: inline-block;
  `,
)

export const Outlink = ({
  href,
  children,
  fontVariant = 'smallBold',
  icon = OutlinkSVG,
  iconPosition = 'before',
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
    fontVariant?: FontVariant
    icon?: AsProp
    iconPosition?: 'before' | 'after'
  }) => {
  const innerContent = (
    <>
      {iconPosition === 'before' ? <OutlinkIcon as={icon} /> : null}
      <OutlinkTypography fontVariant={fontVariant} color="blue">
        {children}
      </OutlinkTypography>
      {iconPosition === 'after' ? <OutlinkIcon as={icon} /> : null}
    </>
  )

  // External URLs: use plain anchor with target="_blank"
  if (typeof href === 'string' && href.startsWith('http')) {
    return (
      <StyledAnchor
        href={href}
        rel="noreferrer noopener"
        target="_blank"
        role="link"
        {...props}
      >
        {innerContent}
      </StyledAnchor>
    )
  }

  // Internal URLs: use BaseLink for routing
  return (
    <StyledBaseLink href={href} role="link" {...props}>
      {innerContent}
    </StyledBaseLink>
  )
}
