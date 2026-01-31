import { supabaseRequest } from '../supabaseClient';
import type { Availability, Response } from '../types';

interface ResponseRow {
  poll_id: string;
  slot_id: string;
  session_id: string;
  availability: Availability;
}

function toResponse(row: ResponseRow): Response {
  return {
    pollId: row.poll_id,
    slotId: row.slot_id,
    sessionId: row.session_id,
    availability: row.availability,
  };
}

export async function listResponses(pollId: string): Promise<Response[]> {
  const rows = await supabaseRequest<ResponseRow[]>('responses', {
    params: {
      select: '*',
      poll_id: `eq.${pollId}`,
    },
  });

  return rows.map(toResponse);
}

export async function listResponsesForPolls(pollIds: string[]): Promise<Response[]> {
  if (!pollIds.length) return [];

  const rows = await supabaseRequest<ResponseRow[]>('responses', {
    params: {
      select: '*',
      poll_id: `in.(${pollIds.join(',')})`,
    },
  });

  return rows.map(toResponse);
}

export async function upsertResponse(
  pollId: string,
  slotId: string,
  sessionId: string,
  availability: Availability
): Promise<void> {
  await supabaseRequest('responses', {
    method: 'POST',
    params: {
      on_conflict: 'poll_id,slot_id,session_id',
    },
    headers: {
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: {
      poll_id: pollId,
      slot_id: slotId,
      session_id: sessionId,
      availability,
    },
  });
}
