/**
 * Chain-aware test constants.
 *
 * All test files should use these instead of hardcoding 'eth', 'etc', '.eth', '.etc', etc.
 * This ensures the test suite passes on any EVM chain (ETC, ETH, BNB, …)
 * by deriving values from the same config the app uses at runtime.
 */
import {
  getCurrentTld,
  getNativeCoinKey,
  getNativeCoinType,
  getNativeCoinSymbol,
} from '@app/constants/tld'

/** Current chain's TLD without dot — e.g. 'etc', 'eth', 'bnb' */
export const TLD = getCurrentTld()

/** Current chain's TLD with dot — e.g. '.etc', '.eth' */
export const DOT_TLD = `.${TLD}` as const

/** Native coin record key (same as TLD) — e.g. 'etc', 'eth' */
export const COIN_KEY = getNativeCoinKey()

/** SLIP-44 coin type number — e.g. 61 (ETC), 60 (ETH) */
export const COIN_TYPE = getNativeCoinType()

/** Uppercase symbol — e.g. 'ETC', 'ETH' */
export const COIN_SYMBOL = getNativeCoinSymbol()

// ── helpers ──────────────────────────────────────────────────────────

/** Build a 2LD domain for the current chain — `testDomain('alice') => 'alice.etc'` */
export const testDomain = (label: string) => `${label}.${TLD}`

/** Build a subdomain — `testSub('sub','alice') => 'sub.alice.etc'` */
export const testSub = (sub: string, label: string) => `${sub}.${label}.${TLD}`

/** Build a deep subdomain — `testDeepSub('a','b','alice') => 'a.b.alice.etc'` */
export const testDeepSub = (...labels: string[]) => labels.join('.') + DOT_TLD
