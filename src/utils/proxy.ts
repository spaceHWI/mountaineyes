const DEFAULT_PROXY_BASE_URL = 'https://mountaineyes-proxy.onrender.com'

export const getProxyBaseUrl = () =>
  (import.meta.env.VITE_PROXY_BASE_URL ?? DEFAULT_PROXY_BASE_URL).replace(/\/$/, '')

export const withProxyBase = (path: string) => `${getProxyBaseUrl()}${path}`
