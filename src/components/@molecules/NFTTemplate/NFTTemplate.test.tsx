import { readFileSync } from 'fs'
import { cleanup, render, waitFor } from '@app/test-utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import NFTTemplate from './NFTTemplate'
import { testDomain, testSub } from '@root/test/chainConstants'

describe('NFTTemplate', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render', async () => {
    const { getByText } = render(
      <NFTTemplate name={testDomain('nick')} backgroundImage={undefined} isNormalised />,
    )
    expect(getByText(testDomain('nick'))).toBeInTheDocument()
  })

  it('should render with background', async () => {
    const whiteBG =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg=='
    const { getByText, getByTestId } = render(
      <NFTTemplate name={testDomain('validator')} backgroundImage={whiteBG} isNormalised />,
    )
    expect(getByText(testDomain('validator'))).toBeInTheDocument()
    expect(getByTestId('nft-back-img')).toBeInTheDocument()
  })

  it('should render with subdomain', async () => {
    const { getByText } = render(
      <NFTTemplate name={testSub('itsasubdomain', 'khori')} backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('itsasubdomain.')).toBeInTheDocument()
  })

  it('should render domain with more than 25 chars', async () => {
    const { getByText } = render(
      <NFTTemplate
        name={testDomain('thisnameislongerthan25char')}
        backgroundImage={undefined}
        isNormalised
      />,
    )
    expect(getByText('thisnameislonge')).toBeInTheDocument()
    expect(getByText(testDomain('rthan25char'))).toBeInTheDocument()
  })

  it('should use polyfill of Intl.Segmenter if browser does not support', async () => {
    const breakIterator = readFileSync('./public/wasm/break_iterator.wasm')
    ;(window.Intl.Segmenter as (typeof Intl)['Segmenter']) = undefined as any
    vi.spyOn(window, 'fetch').mockImplementation(
      async () =>
        new Response(breakIterator, {
          headers: {
            'content-type': 'application/wasm',
          },
        }),
    )
    const { getByText } = render(
      <NFTTemplate name={testDomain('alisha')} backgroundImage={undefined} isNormalised />,
    )
    await waitFor(() => expect(getByText(testDomain('alisha'))).toBeInTheDocument())
    expect(getByText(testDomain('alisha'))).toBeInTheDocument()
  })
})
