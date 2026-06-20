import { useParams } from 'react-router-dom'

export function useStoreSlug() {
  const params = useParams()
  return params.slug ?? 'bar-uendell3-250'
}
