'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { fetchPoll } from './api/polls'
import { submitResponse } from './api/responses'
import { addParticipant } from './api/participants'
import { createPollRealtimeSubscription } from './supabase'
import { Availability, Poll } from './types'
import { getSessionId } from './utils'

// Poll query key factory
export const pollKeys = {
  all: ['polls'] as const,
  detail: (id: string) => ['polls', id] as const,
}

// Fetch poll with Supabase Realtime updates.
// Falls back to a 60s polling interval in case the WebSocket connection drops.
export function usePoll(pollId: string) {
  const queryClient = useQueryClient()

  // Subscribe to Realtime on mount, unsubscribe on unmount
  useEffect(() => {
    if (!pollId) return

    const cleanup = createPollRealtimeSubscription(pollId, () => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    })

    return cleanup
  }, [pollId, queryClient])

  return useQuery({
    queryKey: pollKeys.detail(pollId),
    queryFn: () => fetchPoll(pollId),
    enabled: !!pollId,
    // 60s fallback polling — covers the case where Realtime WS drops
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    staleTime: 2000,
  })
}

// Submit response mutation
export function useSubmitResponse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pollId,
      slotId,
      availability,
    }: {
      pollId: string
      slotId: string
      availability: Availability
    }) => {
      const sessionId = getSessionId()
      await submitResponse(pollId, slotId, sessionId, availability)
    },
    onMutate: async ({ pollId, slotId, availability }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: pollKeys.detail(pollId) })

      // Snapshot previous value
      const previousPoll = queryClient.getQueryData<Poll>(pollKeys.detail(pollId))

      // Optimistically update
      if (previousPoll) {
        const sessionId = getSessionId()
        const existingResponseIndex = previousPoll.responses.findIndex(
          (r) => r.slotId === slotId && r.sessionId === sessionId
        )

        const updatedResponses = [...previousPoll.responses]

        if (existingResponseIndex >= 0) {
          updatedResponses[existingResponseIndex] = {
            ...updatedResponses[existingResponseIndex],
            availability,
          }
        } else {
          updatedResponses.push({
            id: `optimistic-${Date.now()}`,
            pollId,
            slotId,
            sessionId,
            availability,
          })
        }

        queryClient.setQueryData<Poll>(pollKeys.detail(pollId), {
          ...previousPoll,
          responses: updatedResponses,
        })
      }

      return { previousPoll }
    },
    onError: (err, { pollId }, context) => {
      // Rollback on error
      if (context?.previousPoll) {
        queryClient.setQueryData(pollKeys.detail(pollId), context.previousPoll)
      }
    },
    onSettled: (_, __, { pollId }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

// Add participant mutation
export function useAddParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      pollId,
      displayName,
    }: {
      pollId: string
      displayName: string
    }) => {
      const sessionId = getSessionId()
      await addParticipant(pollId, sessionId, displayName)
    },
    onSuccess: (_, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: pollKeys.detail(pollId) })
    },
  })
}

// Check if current user has joined the poll
export function useIsParticipant(poll: Poll | null | undefined): boolean {
  if (!poll) return false

  const sessionId = typeof window !== 'undefined' ? getSessionId() : ''
  return poll.participants.some((p) => p.sessionId === sessionId)
}

// Get current user's responses for a poll
export function useUserResponses(poll: Poll | null | undefined): Record<string, Availability> {
  if (!poll) return {}

  const sessionId = typeof window !== 'undefined' ? getSessionId() : ''
  const responses: Record<string, Availability> = {}

  for (const response of poll.responses) {
    if (response.sessionId === sessionId) {
      responses[response.slotId] = response.availability
    }
  }

  return responses
}
