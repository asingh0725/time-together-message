import { supabaseRequest } from '../supabase'
import { ParticipantRow, Participant, transformParticipant } from '../types'

export async function addParticipant(
  pollId: string,
  sessionId: string,
  displayName: string
): Promise<void> {
  await supabaseRequest('participants?on_conflict=poll_id,session_id', {
    method: 'POST',
    body: {
      poll_id: pollId,
      session_id: sessionId,
      display_name: displayName,
    },
    headers: {
      Prefer: 'return=minimal,resolution=merge-duplicates',
    },
  })
}

export async function fetchParticipants(pollId: string): Promise<Participant[]> {
  const rows = await supabaseRequest<ParticipantRow[]>('participants', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
    },
  })

  return (rows || []).map(transformParticipant)
}

export async function getParticipant(
  pollId: string,
  sessionId: string
): Promise<Participant | null> {
  const rows = await supabaseRequest<ParticipantRow[]>('participants', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
      session_id: `eq.${sessionId}`,
      limit: '1',
    },
  })

  if (!rows || rows.length === 0) {
    return null
  }

  return transformParticipant(rows[0])
}
