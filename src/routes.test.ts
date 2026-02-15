import { describe, expect, it } from 'vitest'

import { getDestination } from './routes'

describe('getDestination', () => {
  describe('query parameter handling', () => {
    it('should preserve referrer query parameter', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: { referrer: 'partner123' },
      })

      expect(result).toEqual({
        pathname: '/test.etc',
        query: { referrer: 'partner123' },
      })
    })

    it('should preserve multiple query parameters', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: { referrer: 'partner123', from: '/home', tab: 'records' },
      })

      expect(result).toEqual({
        pathname: '/test.etc',
        query: { referrer: 'partner123', from: '/home', tab: 'records' },
      })
    })

    it('should handle empty query object', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: {},
      })

      expect(result).toEqual({
        pathname: '/test.etc',
        query: {},
      })
    })

    it('should handle missing query property', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
      })

      expect(result).toEqual({
        pathname: '/test.etc',
        query: {},
      })
    })
  })

  describe('path rewriting', () => {
    it('should rewrite /profile/:name to flattened path', () => {
      const result = getDestination({
        pathname: '/profile/vitalik.etc',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/vitalik.etc',
        query: { referrer: 'test' },
      })
    })

    it('should rewrite /register/:name to flattened path with query', () => {
      const result = getDestination({
        pathname: '/register/test.etc',
        query: { referrer: 'partner' },
      })

      expect(result).toEqual({
        pathname: '/test.etc/register',
        query: { referrer: 'partner' },
      })
    })

    it('should rewrite /address/:address to flattened path', () => {
      const result = getDestination({
        pathname: '/address/0x1234567890abcdef',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/0x1234567890abcdef',
        query: { referrer: 'test' },
      })
    })

    it('should add /tld prefix for single-label names', () => {
      const result = getDestination({
        pathname: '/profile/eth',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/tld/eth',
        query: { referrer: 'test' },
      })
    })
  })

  describe('special characters', () => {
    it('should handle names with # character', () => {
      const result = getDestination({
        pathname: '/profile/test#name.etc',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/test%23name.etc',
        query: { referrer: 'test' },
      })
    })

    it('should preserve query parameters with special characters', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: { referrer: 'partner&co', from: '/test?param=value' },
      })

      expect(result).toEqual({
        pathname: '/test.etc',
        query: { referrer: 'partner&co', from: '/test?param=value' },
      })
    })
  })

  describe('edge cases', () => {
    it('should handle root path', () => {
      const result = getDestination({
        pathname: '/',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/',
        query: { referrer: 'test' },
      })
    })

    it('should handle paths that do not match rewrite rules', () => {
      const result = getDestination({
        pathname: '/some/random/path',
        query: { referrer: 'test' },
      })

      expect(result).toEqual({
        pathname: '/some/random/path',
        query: { referrer: 'test' },
      })
    })
  })

  describe('query object format (regression test)', () => {
    it('should return query as object, not string', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: { referrer: 'test', from: '/home' },
      })

      // This is the key regression test - query should be an object
      expect(typeof result.query).toBe('object')
      expect(typeof result.query).not.toBe('string')
      expect(result.query).toHaveProperty('referrer', 'test')
      expect(result.query).toHaveProperty('from', '/home')
    })

    it('should not return query as URLSearchParams string format', () => {
      const result = getDestination({
        pathname: '/profile/test.etc',
        query: { referrer: 'test' },
      })

      // Ensure it's not in "referrer=test" format
      expect(result.query).not.toBe('referrer=test')
      expect(result.query).toEqual({ referrer: 'test' })
    })
  })
})
