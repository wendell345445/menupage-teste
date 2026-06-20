import { useEffect, useState } from 'react'

import { getMenuData, type MenuData } from '@/services/menu.service'

interface UseMenuState {
  data: MenuData | null
  isLoading: boolean
  error: Error | null
}

/**
 * Hook isolado para carregar o cardápio.
 *
 * Enquanto o backend não existe, `getMenuData` retorna mock local.
 * O dev do backend só precisa trocar a implementação do adapter em
 * `src/services/menu.service.ts`.
 */
export function useMenu(slug: string | null) {
  const [state, setState] = useState<UseMenuState>({
    data: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    setState((current) => ({ ...current, isLoading: true, error: null }))

    getMenuData(slug)
      .then((data) => {
        if (!isMounted) return
        setState({ data, isLoading: false, error: null })
      })
      .catch((error) => {
        if (!isMounted) return
        setState({ data: null, isLoading: false, error: error instanceof Error ? error : new Error('Erro ao carregar cardápio') })
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  return state
}
