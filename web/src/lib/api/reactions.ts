import { supabaseRequest } from '../supabase'
import { ReactionRow, Reaction, transformReaction } from '../types'

export async function fetchReactions(pollId: string): Promise<Reaction[]> {
  const rows = await supabaseRequest<ReactionRow[]>('reactions', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
      order: 'created_at.asc',
    },
  })
  return (rows || []).map(transformReaction)
}

export async function submitReaction(
  pollId: string,
  sessionId: string,
  emoji: string,
  comment: string | null
): Promise<void> {
  const body: Record<string, string> = { poll_id: pollId, session_id: sessionId, emoji }
  if (comment && comment.trim()) {
    body.comment = comment.trim()
  }
  await supabaseRequest(`reactions?on_conflict=poll_id,session_id`, {
    method: 'POST',
    body,
    headers: { Prefer: 'return=minimal,resolution=merge-duplicates' },
  })
}
