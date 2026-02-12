import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import FaucetBanner from '@app/components/@molecules/FaucetBanner'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LeadingHeading } from '@app/components/LeadingHeading'
// import { AnnouncementBanner } from '@app/components/pages/AnnouncementBanner' // Hidden for ECNS - ENSv2 not applicable
import { VerificationErrorDialog } from '@app/components/pages/VerificationErrorDialog'
import { useVerificationOAuthHandler } from '@app/hooks/verification/useVerificationOAuthHandler/useVerificationOAuthHandler'

import ENSFull from '../assets/ENSFull.svg'

// Dynamic import for Unicorn Studio background (SSR disabled)
const UnicornBackground = dynamic(
  () => import('@app/components/@atoms/UnicornBackground'),
  { ssr: false }
)

// ECNS Green gradient
const ECNS_GRADIENT = 'linear-gradient(330.4deg, #1A3A2E 4.54%, #3FB68B 59.2%, #4FD4A4 148.85%)'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${ECNS_GRADIENT};
    background-repeat: no-repeat;
    background-size: 110%;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    @media (min-width: ${theme.breakpoints.sm}px) {
      font-size: ${theme.fontSizes.headingOne};
    }
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
    line-height: 150%;
    text-align: center;
    margin-bottom: ${theme.space['3']};
  `,
)

const Container = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    z-index: 1;
  `,
)

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
  `,
)

const StyledENS = styled(ENSFull)(
  ({ theme }) => css`
    height: ${theme.space['8.5']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const StyledLeadingHeading = styled(LeadingHeading)(
  ({ theme }) => css`
    position: relative;
    z-index: 2;
    @media (min-width: ${theme.breakpoints.sm}px) {
      display: none;
    }
  `,
)

export default function Page() {
  const { t } = useTranslation('common')

  const { dialogProps } = useVerificationOAuthHandler()

  return (
    <>
      <Head>
        <title>ECNS - Ethereum Classic Name Service</title>
      </Head>
      <UnicornBackground />
      <StyledLeadingHeading>
        <LogoAndLanguage>
          <StyledENS />
        </LogoAndLanguage>
        <Hamburger />
      </StyledLeadingHeading>
      <FaucetBanner />
      <Container>
        <Stack>
          <GradientTitle>{t('title')}</GradientTitle>
          <SubtitleWrapper>
            <Typography fontVariant="large" color="grey">
              {t('description')}
            </Typography>
          </SubtitleWrapper>
          <SearchInput />

          {/* <AnnouncementBanner /> - Hidden for ECNS - ENSv2 not applicable */}
        </Stack>
      </Container>
      <VerificationErrorDialog {...(dialogProps ?? {})} />
    </>
  )
}
