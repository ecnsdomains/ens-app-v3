import { describe, expect, it } from 'vitest'

import { createUrlObject } from './urlObject'

describe('createUrlObject', () => {
  describe('when href is a string', () => {
    it('should convert string href to UrlObject with pathname', () => {
      const result = createUrlObject('/profile/vitalik.etc')

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: {},
      })
    })

    it('should add query parameters to string href', () => {
      const result = createUrlObject('/profile/vitalik.etc', { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'partner123' },
      })
    })

    it('should handle multiple query parameters', () => {
      const result = createUrlObject('/profile/vitalik.etc', {
        referrer: 'partner123',
        from: '/',
      })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'partner123', from: '/' },
      })
    })
  })

  describe('when href is a UrlObject', () => {
    it('should return UrlObject as-is when no additional query', () => {
      const urlObject = { pathname: '/profile/vitalik.etc' }
      const result = createUrlObject(urlObject)

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
      })
    })

    it('should add query parameters to UrlObject without existing query', () => {
      const urlObject = { pathname: '/profile/vitalik.etc' }
      const result = createUrlObject(urlObject, { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'partner123' },
      })
    })

    it('should merge query parameters with existing query', () => {
      const urlObject = { pathname: '/profile/vitalik.etc', query: { tab: 'records' } }
      const result = createUrlObject(urlObject, { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { tab: 'records', referrer: 'partner123' },
      })
    })

    it('should override existing query parameters with new ones', () => {
      const urlObject = { pathname: '/profile/vitalik.etc', query: { referrer: 'old' } }
      const result = createUrlObject(urlObject, { referrer: 'new' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'new' },
      })
    })

    it('should preserve other UrlObject properties', () => {
      const urlObject = {
        pathname: '/profile/vitalik.etc',
        hash: '#section',
        query: { tab: 'records' },
      }
      const result = createUrlObject(urlObject, { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        hash: '#section',
        query: { tab: 'records', referrer: 'partner123' },
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty additionalQuery object', () => {
      const result = createUrlObject('/profile/vitalik.etc', {})

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: {},
      })
    })

    it('should handle undefined additionalQuery', () => {
      const result = createUrlObject('/profile/vitalik.etc', undefined)

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: {},
      })
    })

    it('should handle undefined values in additionalQuery', () => {
      const result = createUrlObject('/profile/vitalik.etc', {
        referrer: 'partner123',
        other: undefined,
      })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'partner123', other: undefined },
      })
    })

    it('should filter out undefined values from additionalQuery', () => {
      const result = createUrlObject('/profile/vitalik.etc', {
        referrer: undefined,
        from: '/',
      })

      // Should only include 'from', not 'referrer'
      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { from: '/' },
      })
      expect(result.query).not.toHaveProperty('referrer')
    })

    it('should handle root path', () => {
      const result = createUrlObject('/', { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/',
        query: { referrer: 'partner123' },
      })
    })

    it('should handle paths with existing query strings', () => {
      const result = createUrlObject('/profile/vitalik.etc?tab=records', { referrer: 'partner123' })

      expect(result).toEqual({
        pathname: '/profile/vitalik.etc',
        query: { tab: 'records', referrer: 'partner123' },
      })
    })
  })
})
