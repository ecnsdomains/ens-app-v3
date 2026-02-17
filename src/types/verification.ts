export type VerifiableCredential = {
  type: Array<'VerifiedCredential' | string>
  credentialSubject?: {
    ethAddress?: string
    ensName?: string
    username?: string
    name?: string
    verifiedEmail?: string
  }
} & Record<string, unknown>
