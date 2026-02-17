import { ElementType } from 'react'
import styled, { css, DefaultTheme } from 'styled-components'

const SocialIconWrapper = styled.a(
  ({ theme }) => css`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['6']};
    min-height: ${theme.space['6']};
  `,
)

const StyledIcon = styled.svg<{ $iconColor?: string }>(
  ({ theme, $iconColor }) => css`
    height: 100%;
    position: absolute;
    transition: 0.15s all ease-in-out;
    fill: ${theme.colors.greyPrimary};

    ${SocialIconWrapper}:hover && {
      fill: ${$iconColor};
    }
  `,
)

const StyledColoredIcon = styled.svg(
  ({ theme: _theme }: { theme: DefaultTheme }) => css`
    height: 100%;
    position: absolute;
    transition: 0.15s all ease-in-out;
    opacity: 0;

    ${SocialIconWrapper}:hover && {
      opacity: 1;
    }
  `,
)

export const SocialIcon = ({
  Icon,
  ColoredIcon,
  color,
  href,
}: {
  Icon: ElementType
  ColoredIcon?: ElementType
  color?: string
  href: string
}) => {
  return (
    <SocialIconWrapper href={href} target="_blank">
      <StyledIcon as={Icon} $iconColor={color} />
      {ColoredIcon && <StyledColoredIcon as={ColoredIcon} />}
    </SocialIconWrapper>
  )
}
