import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { AvatarWithLink } from './AvatarWithLink'
import { testDomain } from '@root/test/chainConstants'

vi.mock('next/router', () => ({
  useRouter: () => ({
    query: {},
    pathname: '/',
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    reload: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  }),
}))

vi.mock('@app/routes', () => ({
  getDestinationAsHref: (urlObject: any) => urlObject.pathname,
}))

describe('AvatarWithLink', () => {
  it('should render', async () => {
    render(<AvatarWithLink label="label" name={testDomain('test')} />)
    expect(screen.getByTestId('avatar-with-link')).toHaveAttribute('href', '/profile/test.etc')
  })
})
