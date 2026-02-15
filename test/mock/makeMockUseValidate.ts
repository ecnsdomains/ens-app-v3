/* eslint-disable @typescript-eslint/naming-convention */
import { match } from 'ts-pattern'

import { ValidationResult } from '@app/hooks/useValidate'
import { TLD, DOT_TLD, testDomain, testSub } from '../chainConstants'

export const mockUseValidateConfig = {
  eth: { input: TLD },
  dns: { input: 'com' },
  'valid-2ld': { input: testDomain('name') },
  'valid-2ld:dns': { input: 'name.com' },
  'invalid-2ld': { input: `name❤️${DOT_TLD}` },
  'valid-subname': { input: testSub('subname', 'name') },
}
export type MockUseValidateType = keyof typeof mockUseValidateConfig
export const mockUseValidateTypes = Object.keys(mockUseValidateConfig) as MockUseValidateType[]

export const makeMockUseValidate = (type: MockUseValidateType): ValidationResult => {
  return match(type)
    .with('eth', () => ({
      type: 'label' as const,
      isShort: false,
      isValid: true,
      is2LD: false,
      isNativeTld: true,
      labelDataArray: [
        {
          input: [...Buffer.from(TLD)],
          offset: 0,
          tokens: [[...Buffer.from(TLD)]],
          type: 'ASCII',
          output: [...Buffer.from(TLD)],
        },
      ],
      name: TLD,
      beautifiedName: TLD,
      isNonASCII: false,
      labelCount: 1,
    }))
    .with('dns', () => ({
      type: 'label' as const,
      isShort: false,
      isValid: true,
      is2LD: false,
      isNativeTld: false,
      labelDataArray: [
        {
          input: [99, 111, 109],
          offset: 0,
          tokens: [[99, 111, 109]],
          type: 'ASCII',
          output: [99, 111, 109],
        },
      ],
      name: 'com',
      beautifiedName: 'com',
      isNonASCII: false,
      labelCount: 1,
    }))
    .with('valid-2ld', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isNativeTld: true,
      labelDataArray: [
        {
          input: [110, 97, 109, 101],
          offset: 0,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [...Buffer.from(TLD)],
          offset: 5,
          tokens: [[...Buffer.from(TLD)]],
          type: 'ASCII',
          output: [...Buffer.from(TLD)],
        },
      ],
      name: testDomain('name'),
      beautifiedName: testDomain('name'),
      isNonASCII: false,
      labelCount: 2,
    }))
    .with('valid-2ld:dns', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isNativeTld: false,
      labelDataArray: [
        {
          input: [110, 97, 109, 101],
          offset: 0,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [99, 111, 109],
          offset: 5,
          tokens: [[99, 111, 109]],
          type: 'ASCII',
          output: [99, 111, 109],
        },
      ],
      name: 'name.com',
      beautifiedName: 'name.com',
      isNonASCII: false,
      labelCount: 2,
    }))
    .with('invalid-2ld', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isNativeTld: true,
      labelDataArray: [
        {
          input: [110, 97, 109, 101, 10084],
          offset: 0,
          tokens: [[110, 97, 109, 101], [10084]],
          emoji: true,
          type: 'Latin',
          output: [110, 97, 109, 101, 10084],
        },
        {
          input: [...Buffer.from(TLD)],
          offset: 6,
          tokens: [[...Buffer.from(TLD)]],
          type: 'ASCII',
          emoji: undefined,
          output: [...Buffer.from(TLD)],
        },
      ],
      name: `name❤${DOT_TLD}`,
      beautifiedName: `name❤️${DOT_TLD}`,
      isNonASCII: true,
      labelCount: 2,
    }))
    .with('valid-subname', () => ({
      type: 'name' as const,
      name: testSub('subname', 'name'),
      isShort: false,
      isValid: true,
      is2LD: false,
      isNativeTld: true,
      labelDataArray: [
        {
          input: [115, 117, 98, 110, 97, 109, 101],
          offset: 0,
          tokens: [[115, +117, +98, +110, +97, +109, +101]],
          type: 'ASCII',
          output: [115, +117, +98, +110, +97, +109, +101],
        },
        {
          input: [110, 97, 109, 101],
          offset: 8,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [...Buffer.from(TLD)],
          offset: 13,
          tokens: [[...Buffer.from(TLD)]],
          type: 'ASCII',
          output: [...Buffer.from(TLD)],
        },
      ],
      beautifiedName: testSub('subname', 'name'),
      isNonASCII: false,
      labelCount: 3,
    }))
    .exhaustive()
}
