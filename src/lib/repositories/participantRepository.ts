import { supabaseRequest } from '../supabaseClient';
import type { Participant } from '../types';

interface ParticipantRow {
  poll_id: string;
  session_id: string;
  display_name: string | null;
}

export async function upsertParticipant(participant: Participant): Promise<void> {
  await supabaseRequest('participants', {
    method: 'POST',
    params: {
      on_conflict: 'poll_id,session_id',
    },
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: {
      poll_id: participant.pollId,
      session_id: participant.sessionId,
      display_name: participant.displayName ?? null,
    },
  });
}

export async function updateDisplayNameForSession(
  sessionId: string,
  displayName: string
): Promise<void> {
  await supabaseRequest('participants', {
    method: 'PATCH',
    params: {
      session_id: `eq.${sessionId}`,
    },
    headers: {
      Prefer: 'return=minimal',
    },
    body: {
      display_name: displayName,
    },
  });
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
  });

  if (!rows.length) return null;

  return {
    pollId: rows[0].poll_id,
    sessionId: rows[0].session_id,
    displayName: rows[0].display_name,
  };
}
