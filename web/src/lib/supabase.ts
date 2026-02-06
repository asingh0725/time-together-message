const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

const baseUrl = `${supabaseUrl}/rest/v1`

export interface SupabaseRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  params?: Record<string, string>
  body?: unknown
  headers?: Record<string, string>
}

export class SupabaseError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export async function supabaseRequest<T>(
  path: string,
  { method = 'GET', params, body, headers = {} }: SupabaseRequestOptions = {}
): Promise<T> {
  const url = new URL(`${baseUrl}/${path}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        apikey: supabaseAnonKey!,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Supabase ${method} ${path} failed:`, response.status, errorText)
      throw new SupabaseError(
        `Request failed with status ${response.status}`,
        response.status,
        errorText
      )
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T
    }

    const text = await response.text()
    if (!text) {
      return null as T
    }

    return JSON.parse(text) as T
  } catch (error) {
    if (error instanceof SupabaseError) {
      throw error
    }
    console.error(`Supabase request error for ${method} ${path}:`, error)
    throw new SupabaseError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    )
  }
}

// Realtime subscription helper using Server-Sent Events
// Note: For true realtime, you'd use Supabase Realtime which requires the supabase-js client
// For simplicity, we'll use polling with React Query's refetch capabilities
export function createRealtimeChannel() {
  // This is a placeholder - for true realtime, integrate @supabase/supabase-js
  // For now, we rely on React Query's refetchInterval for pseudo-realtime
  console.log('Realtime: Using polling-based updates')
}
