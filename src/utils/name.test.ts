import { describe, expect, it } from 'vitest'

import { nameLevel, parentName } from './name'
import { TLD, testDomain, testSub } from '@root/test/chainConstants'

describe('nameLevel', () => {
  it('should return correct value for a subname ', () => {
    expect(nameLevel(testSub('subname', 'test'))).toEqual('subname')
  })

  it('should return correct value for a 2ld ', () => {
    expect(nameLevel(testDomain('test'))).toEqual('2ld')
  })

  it('should return correct value for a tld', () => {
    expect(nameLevel('etc')).toEqual('tld')
  })

  it('should return the correct value for [root]', () => {
    expect(nameLevel('[root]')).toEqual('root')
  })
})

describe('parentName', () => {
  it('should return a 2ld name for a subname', () => {
    expect(parentName(testSub('subname', 'test'))).toEqual(testDomain('test'))
  })

  it('should return a tld for a 2ld name', () => {
    expect(parentName(testDomain('test'))).toEqual(TLD)
  })

  it('should return a root for a tld', () => {
    expect(parentName('etc')).toEqual('[root]')
  })
})
