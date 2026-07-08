/**
 * Get the API base URL for the current environment.
 * 
 * Requires VITE_CODESPACE_NAME environment variable to be set in .env.local
 * 
 * @returns {string} The API base URL
 */
export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME

  if (!codespaceName) {
    console.warn(
      'VITE_CODESPACE_NAME is not set. Please define it in .env.local. Using fallback localhost.',
    )
    return 'http://localhost:8000/api'
  }

  return `https://${codespaceName}-8000.app.github.dev/api`
}

/**
 * Fetch data from API endpoint with support for pagination and array responses.
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/users', '/activities')
 * @param {Object} options - Fetch options
 * @returns {Promise<Array>} Array of items
 */
export async function fetchFromApi(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Handle paginated responses (data.results) or direct array responses
    if (data && typeof data === 'object') {
      if (Array.isArray(data)) {
        return data
      }
      if (Array.isArray(data.results)) {
        return data.results
      }
      if (Array.isArray(data.data)) {
        return data.data
      }
      // If it's an object with data, return as single-item array
      return [data]
    }

    return []
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
    throw error
  }
}
