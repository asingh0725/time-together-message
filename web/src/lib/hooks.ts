'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchPoll } from './api/polls'
import { submitResponse } from './api/responses'
import { addParticipant } from './api/participants'
import { Availability, Poll } from './types'
import { getSessionId } from './utils'

// Poll query key factory
export const pollKeys = {
  all: ['polls'] as const,
  detail: (id: string) => ['polls', id] as const,
}

// Fetch poll with real-time-ish updates (polling)
export function usePoll(pollId: string, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: pollKeys.detail(pollId),
    queryFn: () => fetchPoll(pollId),
    enabled: !!pollId,
    refetchInterval: options?.refetchInterval ?? 5000, // Poll every 5 seconds for "realtime" updates
    refetchIntervalInBackground: false,
    staleTime: 1000, // Consider data stale after 1 second
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
