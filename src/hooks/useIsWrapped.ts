import { useWrapperData } from './nameservice/public/useWrapperData'

type UseIsWrappedParameters = {
  name: string
  enabled?: boolean
}

export const useIsWrapped = ({ name, enabled = true }: UseIsWrappedParameters) => {
  const { data: wrapperData, ...query } = useWrapperData({ name, enabled })
  return {
    data: !!wrapperData,
    ...query,
  }
}
