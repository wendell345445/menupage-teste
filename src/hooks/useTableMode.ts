import { useLocation } from 'react-router-dom'

export function useTableMode() {
  const { pathname } = useLocation()
  const isTableMode = pathname.startsWith('/mesa')

  return {
    tableNumber: isTableMode ? 12 : null,
    isTableMode,
  }
}
