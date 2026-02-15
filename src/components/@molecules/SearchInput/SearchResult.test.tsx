import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { usePrimaryName } from '@app/hooks/nameservice/public/usePrimaryName'
import { useBasicName } from '@app/hooks/useBasicName'

import { SearchResult, SearchResultProps } from './SearchResult'
import { testDomain } from '@root/test/chainConstants'

vi.mock('@app/hooks/useBasicName')
vi.mock('@app/hooks/nameservice/public/usePrimaryName')

const mockUseBasicName = mockFunction(useBasicName)
const mockUsePrimaryName = mockFunction(usePrimaryName)

describe('SearchResult', () => {
  mockUseBasicName.mockReturnValue({ registrationStatus: 'available', beautifiedName: testDomain('nick') })

  const baseMockData: SearchResultProps = {
    hoverCallback: vi.fn(),
    clickCallback: vi.fn(),
    index: 0,
    selected: false,
    searchItem: {
      nameType: 'native',
      text: testDomain('nick'),
    },
    usingPlaceholder: false,
  }

  it('should render with basic data', () => {
    render(<SearchResult {...baseMockData} />)
    expect(screen.getByText(testDomain('nick'))).toBeVisible()
    expect(screen.getByText('search.status.available')).toBeVisible()
  })
  it('should use registration status if placeholder', () => {
    render(<SearchResult {...baseMockData} usingPlaceholder />)
    expect(screen.getByText(testDomain('nick'))).toBeVisible()
    expect(screen.queryByText('search.status.available')).toBeInTheDocument()
  })
  it('should correctly display an address without a primary name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: {
        name: undefined,
        beautifiedName: undefined,
      },
      isLoading: false,
      status: 'success',
    })
    const mockData: ComponentProps<typeof SearchResult> = {
      ...baseMockData,
      searchItem: {
        nameType: 'address',
        text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
      },
    }
    render(<SearchResult {...mockData} />)
    expect(screen.getByText('0xb6E040...d28cd9')).toBeVisible()
  })
  it('should correctly display an address with a primary name', () => {
    mockUsePrimaryName.mockReturnValue({
      data: {
        name: testDomain('test'),
        beautifiedName: testDomain('test'),
      },
      isLoading: false,
      status: 'success',
    })
    const mockData: ComponentProps<typeof SearchResult> = {
      ...baseMockData,
      searchItem: {
        nameType: 'address',
        text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
      },
    }
    render(<SearchResult {...mockData} />)
    expect(screen.getByText('0xb6E040...d28cd9')).toBeVisible()
    expect(screen.getByText(testDomain('test'))).toBeVisible()
  })
  it('should call hoverCallback on hover', () => {
    render(<SearchResult {...baseMockData} />)
    const element = screen.getByText(testDomain('nick'))
    fireEvent.mouseOver(element)
    expect(baseMockData.hoverCallback).toHaveBeenCalledWith(0)
  })
  it('should call clickCallback on click', () => {
    render(<SearchResult {...baseMockData} />)
    const element = screen.getByText(testDomain('nick'))
    fireEvent.click(element)
    expect(baseMockData.clickCallback).toHaveBeenCalledWith(0)
  })
  it('should show address as clickable', () => {
    mockUsePrimaryName.mockReturnValue({
      data: {
        name: undefined,
        beautifiedName: undefined,
      },
      isLoading: false,
      status: 'success',
    })
    const mockData: ComponentProps<typeof SearchResult> = {
      ...baseMockData,
      searchItem: {
        nameType: 'address',
        text: '0xb6E040C9ECAaE172a89bD561c5F73e1C48d28cd9',
      },
    }
    render(<SearchResult {...mockData} />)
    expect(screen.getByTestId('search-result-address')).toHaveStyle('cursor: pointer')
  })
})
