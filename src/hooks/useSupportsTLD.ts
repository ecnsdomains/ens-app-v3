import { isCurrentTld } from '@app/constants/tld'
import { getTldFromName } from '@app/utils/utils'

import { useDnsSecEnabled } from './dns/useDnsSecEnabled'

export const useSupportsTLD = (name = '') => {
  const tld = getTldFromName(name)
  const { data: isDnsSecEnabled, ...query } = useDnsSecEnabled({ name: tld })
  return {
    data: isCurrentTld(tld ?? '') || tld === '[root]' || isDnsSecEnabled,
    ...query,
  }
}
