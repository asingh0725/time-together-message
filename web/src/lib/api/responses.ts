import { supabaseRequest } from '../supabase'
import { Availability, ResponseRow, Response, transformResponse } from '../types'

export async function submitResponse(
  pollId: string,
  slotId: string,
  sessionId: string,
  availability: Availability
): Promise<void> {
  // First, delete any existing response for this combination
  await supabaseRequest(
    `responses?poll_id=eq.${pollId}&slot_id=eq.${slotId}&session_id=eq.${sessionId}`,
    {
      method: 'DELETE',
    }
  )

  // Then insert the new response
  await supabaseRequest('responses', {
    method: 'POST',
    body: {
      poll_id: pollId,
      slot_id: slotId,
      session_id: sessionId,
      availability,
    },
    headers: {
      Prefer: 'return=minimal',
    },
  })
}

export async function fetchResponses(pollId: string): Promise<Response[]> {
  const rows = await supabaseRequest<ResponseRow[]>('responses', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
    },
  })

  return (rows || []).map(transformResponse)
}

export async function fetchUserResponses(
  pollId: string,
  sessionId: string
): Promise<Response[]> {
  const rows = await supabaseRequest<ResponseRow[]>('responses', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
      session_id: `eq.${sessionId}`,
    },
  })

  return (rows || []).map(transformResponse)
}
