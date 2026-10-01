import { useEffect, useState } from 'react'

export function normalizeCollection(payload, resourceKey) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const candidates = [payload[resourceKey], payload.results, payload.items, payload.data, payload.data?.results, payload.data?.items]
  return candidates.find(Array.isArray) ?? []
}

export function matchesSearch(query, ...values) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  return !normalizedQuery || values.filter(Boolean).join(' ').toLocaleLowerCase().includes(normalizedQuery)
}

export function displayName(value) {
  if (typeof value === 'string') return value
  return value?.name || value?.username || 'Unknown member'
}

export function formatDate(value) {
  if (!value) return 'Not dated'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not dated'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default function useCollection(endpoint, resourceKey) {
  const [revision, setRevision] = useState(0)
  const [response, setResponse] = useState({ endpoint: '', resourceKey: '', revision: -1, records: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`)
        setResponse({ endpoint, resourceKey, revision, records: normalizeCollection(payload, resourceKey), error: '' })
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setResponse({ endpoint, resourceKey, revision, records: [], error: requestError.message || 'Unable to load this collection' })
        }
      })
    return () => controller.abort()
  }, [endpoint, resourceKey, revision])

  const isCurrent = response.endpoint === endpoint && response.resourceKey === resourceKey && response.revision === revision
  return {
    records: isCurrent ? response.records : [],
    loading: !isCurrent,
    error: isCurrent ? response.error : '',
    reload: () => setRevision((value) => value + 1),
  }
}