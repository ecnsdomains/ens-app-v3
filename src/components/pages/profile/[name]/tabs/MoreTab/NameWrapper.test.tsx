import { render, screen } from '@app/test-utils'

import { makeMockUseWrapperDataData } from '@root/test/mock/makeMockUseWrapperDataData.ts'
import { describe, expect, it, vi } from 'vitest'

import { NameWrapper } from './NameWrapper'
import { testDomain } from '@root/test/chainConstants'

vi.mock('./Token/WrapButton', () => ({ default: () => <div data-testid="wrap-button" /> }))
vi.mock('./Token/UnwrapButton', () => ({ default: () => <div data-testid="unwrap-button" /> }))

describe('NameWrapper', () => {
  it('should show wrapped status for unwrapped name', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        {...{
          name,
          isWrapped: false,
          wrapperData: makeMockUseWrapperDataData(),
          canBeWrapped: true,
        }}
      />,
    )
    expect(screen.getByTestId('namewrapper-status')).toHaveTextContent(
      'tabs.more.token.status.unwrapped',
    )
  })
  it('should show wrapped status for wrapped name', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        {...{
          name,
          isWrapped: true,
          wrapperData: makeMockUseWrapperDataData('wrapped'),
          canBeWrapped: false,
        }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.getByTestId('namewrapper-status')).toHaveTextContent(
      'tabs.more.token.status.wrapped',
    )
  })
  it('should show wrap button if unwrapped', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        address="0xaaa"
        {...({ name, isWrapped: false } as any)}
        ownerData={{
          owner: '0xaaa',
        }}
      />,
    )
    expect(screen.getByTestId('wrap-button')).toBeVisible()
  })
  it('should show unwrap button if wrapped', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        isWrapped
        address={'0xaaa'}
        {...({ name, isWrapped: true, wrapperData: makeMockUseWrapperDataData('wrapped') } as any)}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.queryByTestId('unwrap-button')).toBeInTheDocument()
    expect(screen.getByTestId('unwrap-button')).toBeVisible()
  })
  it('should not show unwrap button if wrapped but not owned', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        isWrapped
        address={'0xaaa'}
        {...({ name, isWrapped: true, wrapperData: makeMockUseWrapperDataData('wrapped') } as any)}
        ownerData={{
          owner: '0xaab',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.queryByTestId('unwrap-button')).not.toBeInTheDocument()
  })
  it('should not show unwrap button if wrapped but disconnected', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        isWrapped
        {...({ name, isWrapped: true, wrapperData: makeMockUseWrapperDataData('wrapped') } as any)}
        ownerData={{
          owner: '0xaab',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.queryByTestId('unwrap-button')).not.toBeInTheDocument()
  })
  it('should show lock icon and disable unwrap button if name is locked', () => {
    const name = testDomain('nick')
    render(
      <NameWrapper
        isWrapped
        canBeWrapped={false}
        address={'0xaaa'}
        {...{ name, wrapperData: makeMockUseWrapperDataData('locked') }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.getByTestId('cannot-unwrap-disabled-button')).toBeDisabled()
    expect(screen.getByTestId('namewrapper-lock-icon')).toBeVisible()
  })
  it('should show PCC record for wrapped names', () => {
    render(
      <NameWrapper
        isWrapped
        canBeWrapped={false}
        address={'0xaaa'}
        {...{ name: testDomain('nick'), wrapperData: makeMockUseWrapperDataData('wrapped') }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.getByTestId('pcc-status')).toHaveTextContent('tabs.more.token.pcc.controllable')
  })
  it('should show PCC for emancipated names', () => {
    render(
      <NameWrapper
        isWrapped
        canBeWrapped={false}
        address={'0xaaa'}
        {...{ name: testDomain('nick'), wrapperData: makeMockUseWrapperDataData('emancipated') }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )

    expect(screen.getByTestId('pcc-status')).toHaveTextContent(
      'tabs.more.token.pcc.not-controllable',
    )
  })
  it('should show PCC record for wrapped names when disconnected', () => {
    render(
      <NameWrapper
        isWrapped
        canBeWrapped={false}
        {...{ name: testDomain('nick'), wrapperData: makeMockUseWrapperDataData('wrapped') }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )
    expect(screen.getByTestId('pcc-status')).toHaveTextContent('tabs.more.token.pcc.controllable')
  })
  it('should show PCC for emancipated names when disconnected', () => {
    render(
      <NameWrapper
        isWrapped
        canBeWrapped={false}
        {...{ name: testDomain('nick'), wrapperData: makeMockUseWrapperDataData('emancipated') }}
        ownerData={{
          owner: '0xaaa',
          ownershipLevel: 'nameWrapper',
        }}
      />,
    )

    expect(screen.getByTestId('pcc-status')).toHaveTextContent(
      'tabs.more.token.pcc.not-controllable',
    )
  })
})
