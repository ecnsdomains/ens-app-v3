import { ElementType } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

import { ExitSVG } from '@ensdomains/thorin'

import { useActiveRoute } from '@app/hooks/useActiveRoute'
import { RouteItemObj } from '@app/routes'

import BaseLink from '../BaseLink'

type LinkWrapperProps = {
  $asText?: boolean
  $disabled?: boolean
  $isActive: boolean
}

const linkWrapperStyles = ({ theme, $asText, $disabled, $isActive }: LinkWrapperProps & { theme: any }) => css`
  --indicator-color: ${theme.colors.accent};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.space['1.5']};
  cursor: pointer;

  color: ${theme.colors.greyPrimary};
  transition: all 0.15s ease-in-out;

  ${!$asText
    ? css`
        width: ${theme.space['9']};
        height: ${theme.space['9']};
      `
    : css`
        svg {
          width: ${theme.space['4']};
          height: ${theme.space['4']};
        }
      `}
  ${$disabled
    ? css`
        color: ${theme.colors.greyBright};
        cursor: not-allowed;
      `
    : css`
        &:hover {
          color: ${$isActive ? theme.colors.accentBright : theme.colors.textPrimary};
        }
      `}
  ${$isActive &&
  css`
    color: ${theme.colors.accent};
  `}
  &::after {
    height: ${theme.space['2']};
    width: ${theme.space['2']};
    border: none;
    top: ${theme.space['0.5']};
    right: ${theme.space['0.5']};
  }
`

// Use styled.div to avoid nested <a> tags when wrapped by Link
const LinkWrapperDiv = styled.div<LinkWrapperProps>(linkWrapperStyles)

const ButtonLinkWrapper = styled.button<LinkWrapperProps>(linkWrapperStyles)

const StyledAnchor = styled.div(
  ({ theme }) => css`
    white-space: nowrap;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.body};
  `,
)

const iconContainerStyles = ({ theme }: { theme: any }) => css`
  width: ${theme.space['6']};
  height: ${theme.space['6']};
`

const StyledExitIcon = styled(ExitSVG)(iconContainerStyles)

// Use a base styled svg that can be swapped via 'as' prop to avoid
// dynamically creating styled components inside render functions
const StyledIconBase = styled.svg(iconContainerStyles)

const DynamicIcon = ({ icon: Icon }: { icon: ElementType }) => {
  return <StyledIconBase as={Icon} data-testid="route-item-icon" />
}

export const RouteItem = ({
  active,
  route,
  hasNotification,
  asText,
}: {
  active?: boolean
  route: RouteItemObj
  hasNotification?: boolean
  asText?: boolean
}) => {
  const { t } = useTranslation('common')
  const activeRoute = useActiveRoute()
  const isActive = active || activeRoute === route.name
  const icon = isActive ? route.icon?.active! : route.icon?.inactive!

  const content = (
    <>
      {asText ? (
        <>
          <DynamicIcon icon={icon} />
          <StyledAnchor data-testid="route-item-text">{t(route.label)}</StyledAnchor>
        </>
      ) : (
        <DynamicIcon icon={icon} />
      )}
    </>
  )

  // When disabled, render as div (no link)
  // When enabled, Link component renders anchor, so use div to avoid nested <a>
  if (route.disabled) {
    return (
      <LinkWrapperDiv
        $asText={asText}
        $isActive={isActive}
        $disabled={route.disabled}
        className="indicator-container"
        data-indicator={hasNotification}
      >
        {content}
      </LinkWrapperDiv>
    )
  }

  return (
    <BaseLink href={route.href}>
      <LinkWrapperDiv
        $asText={asText}
        $isActive={isActive}
        $disabled={route.disabled}
        className="indicator-container"
        data-indicator={hasNotification}
      >
        {content}
      </LinkWrapperDiv>
    </BaseLink>
  )
}

export const DisconnectButton = () => {
  const { mutate: disconnect } = useDisconnect()

  return (
    <ButtonLinkWrapper $isActive={false} onClick={() => disconnect()} type="button">
      <StyledExitIcon />
    </ButtonLinkWrapper>
  )
}
