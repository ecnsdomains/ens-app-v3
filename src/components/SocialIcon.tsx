import { ElementType } from 'react'
import styled, { css } from 'styled-components'

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

const iconStyles = ({ theme, $iconColor }: { theme: any; $iconColor?: string }) => css`
  height: 100%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  fill: ${theme.colors.greyPrimary};

  ${SocialIconWrapper}:hover && {
    fill: ${$iconColor};
  }
`

const coloredIconStyles = ({ theme }: { theme: any }) => css`
  height: 100%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  opacity: 0;

  ${SocialIconWrapper}:hover && {
    opacity: 1;
  }
`

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
  const StyledIcon = styled(Icon)<{ $iconColor?: string }>(iconStyles)
  const StyledColoredIcon = ColoredIcon ? styled(ColoredIcon)(coloredIconStyles) : null

  return (
    <SocialIconWrapper href={href} target="_blank">
      <StyledIcon key={href} $iconColor={color} />
      {StyledColoredIcon && <StyledColoredIcon />}
    </SocialIconWrapper>
  )
}
