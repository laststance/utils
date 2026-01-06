import { useEffect } from 'react'

export function useUnmountEffect(callback: () => void) {
  useEffect(() => {
    return () => callback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
