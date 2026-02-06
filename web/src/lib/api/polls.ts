import { supabaseRequest } from '../supabase'
import {
  PollRow,
  TimeSlotRow,
  ResponseRow,
  ParticipantRow,
  Poll,
  transformPoll,
  transformTimeSlot,
  transformResponse,
  transformParticipant,
} from '../types'

export async function fetchPoll(pollId: string): Promise<Poll | null> {
  // Fetch poll
  const polls = await supabaseRequest<PollRow[]>('polls', {
    params: {
      select: '*',
      id: `eq.${pollId}`,
      limit: '1',
    },
  })

  if (!polls || polls.length === 0) {
    return null
  }

  const pollRow = polls[0]

  // Fetch related data in parallel
  const [timeSlotsRows, responsesRows, participantsRows] = await Promise.all([
    supabaseRequest<TimeSlotRow[]>('time_slots', {
      params: {
        select: '*',
        poll_id: `eq.${pollId}`,
        order: 'day.asc,start_time.asc',
      },
    }),
    supabaseRequest<ResponseRow[]>('responses', {
      params: {
        select: '*',
        poll_id: `eq.${pollId}`,
      },
    }),
    supabaseRequest<ParticipantRow[]>('participants', {
      params: {
        select: '*',
        poll_id: `eq.${pollId}`,
      },
    }),
  ])

  return {
    ...transformPoll(pollRow),
    timeSlots: (timeSlotsRows || []).map(transformTimeSlot),
    responses: (responsesRows || []).map(transformResponse),
    participants: (participantsRows || []).map(transformParticipant),
  }
}

export async function fetchPollBasic(pollId: string): Promise<Omit<Poll, 'timeSlots' | 'responses' | 'participants'> | null> {
  const polls = await supabaseRequest<PollRow[]>('polls', {
    params: {
      select: '*',
      id: `eq.${pollId}`,
      limit: '1',
    },
  })

  if (!polls || polls.length === 0) {
    return null
  }

  return transformPoll(polls[0])
}

export async function finalizePoll(pollId: string, slotId: string): Promise<void> {
  await supabaseRequest(`polls?id=eq.${pollId}`, {
    method: 'PATCH',
    body: {
      status: 'finalized',
      finalized_slot_id: slotId,
    },
    headers: {
      Prefer: 'return=minimal',
    },
  })
}
