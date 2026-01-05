import { useEffect, type EffectCallback } from 'react'

export const useInitialEffect = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}
