/**
 * Metadata URL utilities
 *
 * This module provides utilities for constructing metadata service URLs.
 * Extracted to break dependency cycle between useEnsAvatar and metadataCache.
 */

import { SERVICES } from '@app/constants/brand'

export const META_DATA_BASE_URL = SERVICES.metadataUrl

/**
 * Creates a metadata service URL for name avatars/headers
 * @param name - Name (e.g., 'alice.etc')
 * @param chainName - Chain name (e.g., 'mainnet', 'mordor')
 * @param mediaKey - Media type ('avatar' or 'header')
 * @returns Metadata service URL or null if invalid parameters
 */
export const createMetaDataUrl = ({
  name,
  chainName,
  mediaKey = 'avatar',
}: {
  name?: string
  chainName: string
  mediaKey?: 'avatar' | 'header'
}): string | null => {
  if (!META_DATA_BASE_URL || !name || !chainName || !mediaKey) return null
  return `${META_DATA_BASE_URL}/${chainName}/${mediaKey}/${name}`
}
