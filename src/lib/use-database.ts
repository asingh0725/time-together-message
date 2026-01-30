import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  usePollStore,
  type Availability,
  type DayAvailabilityBlock,
  type TimeSlot,
  type Poll,
  type Response,
} from './poll-store';

// Re-export types from poll-store
export type { Availability, DayAvailabilityBlock, TimeSlot, Response, Poll };

// Preview slot type (before poll is created, no pollId yet)
export interface PreviewTimeSlot {
  id: string;
  startISO: string;
  endISO: string;
}

// Query keys
export const queryKeys = {
  database: ['database'] as const,
  user: ['user'] as const,
  polls: ['polls'] as const,
  myPolls: ['polls', 'mine'] as const,
  respondedPolls: ['polls', 'responded'] as const,
  poll: (id: string) => ['polls', id] as const,
};

// Use Zustand store for all platforms (SQLite has web issues)
// This provides a consistent API while using the working Zustand store

export function useInitDatabase() {
  return useQuery({
    queryKey: queryKeys.database,
    queryFn: async () => {
      // Database initialization not needed for Zustand
      return true;
    },
    staleTime: Infinity,
  });
}

export function useCurrentUser() {
  const currentUserId = usePollStore((s) => s.currentUserId);
  const currentUserName = usePollStore((s) => s.currentUserName);

  return useQuery({
    queryKey: [...queryKeys.user, currentUserId, currentUserName],
    queryFn: async () => ({
      id: currentUserId,
      name: currentUserName,
    }),
    staleTime: 0,
  });
}

export function useSetUserName() {
  const setUserName = usePollStore((s) => s.setUserName);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      setUserName(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
  });
}

export function usePolls() {
  const polls = usePollStore((s) => s.polls);

  return useQuery({
    queryKey: [...queryKeys.polls, polls],
    queryFn: async () => polls,
    staleTime: 0,
  });
}

export function useMyPolls() {
  const getMyPolls = usePollStore((s) => s.getMyPolls);

  return useQuery({
    queryKey: queryKeys.myPolls,
    queryFn: async () => getMyPolls(),
    staleTime: 0,
  });
}

export function useRespondedPolls() {
  const getRespondedPolls = usePollStore((s) => s.getRespondedPolls);

  return useQuery({
    queryKey: queryKeys.respondedPolls,
    queryFn: async () => getRespondedPolls(),
    staleTime: 0,
  });
}

export function usePoll(pollId: string) {
  const getPoll = usePollStore((s) => s.getPoll);

  return useQuery({
    queryKey: queryKeys.poll(pollId),
    queryFn: async () => getPoll(pollId) ?? null,
    enabled: !!pollId,
    staleTime: 0,
  });
}

export function useCreatePoll() {
  const createPoll = usePollStore((s) => s.createPoll);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollData: {
      title: string;
      durationMinutes: number;
      dateRangeStart: string;
      dateRangeEnd: string;
      dayAvailability: DayAvailabilityBlock[];
      timeSlots: PreviewTimeSlot[];
    }): Promise<string> => {
      const pollId = createPoll({
        title: pollData.title,
        durationMinutes: pollData.durationMinutes,
        dateRangeStart: pollData.dateRangeStart,
        dateRangeEnd: pollData.dateRangeEnd,
        dayAvailability: pollData.dayAvailability,
        timeSlots: pollData.timeSlots,
      });
      return pollId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.polls });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPolls });
    },
  });
}

export function useAddResponse() {
  const addResponse = usePollStore((s) => s.addResponse);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pollId,
      slotId,
      availability,
      participantName,
    }: {
      pollId: string;
      slotId: string;
      availability: Availability;
      participantName?: string;
    }) => {
      addResponse(pollId, slotId, availability, participantName);
    },
    onSuccess: (_, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.poll(pollId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.polls });
    },
  });
}

export function useFinalizePoll() {
  const finalizePoll = usePollStore((s) => s.finalizePoll);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, slotId }: { pollId: string; slotId: string }) => {
      finalizePoll(pollId, slotId);
    },
    onSuccess: (_, { pollId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.poll(pollId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.polls });
    },
  });
}

export function useDeletePoll() {
  const deletePoll = usePollStore((s) => s.deletePoll);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollId: string) => {
      deletePoll(pollId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.polls });
      queryClient.invalidateQueries({ queryKey: queryKeys.myPolls });
    },
  });
}

// Helper functions (re-export from poll-store for convenience)
export {
  getDateKey,
  parseDateKey,
  formatTime,
  formatTimeShort,
  generateTimeSlotsFromDayAvailability,
  groupSlotsByDate,
  countDaysWithAvailability,
  formatSlotTime,
  formatSlotDate,
  formatDateHeader,
  formatDateShort,
} from './poll-store';

// Slot stats helper
export function getSlotStats(
  responses: Response[],
  slotId: string
): { yes: number; maybe: number; no: number; total: number } {
  const slotResponses = responses.filter((r) => r.slotId === slotId);
  return {
    yes: slotResponses.filter((r) => r.availability === 'yes').length,
    maybe: slotResponses.filter((r) => r.availability === 'maybe').length,
    no: slotResponses.filter((r) => r.availability === 'no').length,
    total: slotResponses.length,
  };
}

// Rank slots helper
export function rankSlots(
  timeSlots: TimeSlot[],
  responses: Response[]
): TimeSlot[] {
  return [...timeSlots].sort((a, b) => {
    const statsA = getSlotStats(responses, a.id);
    const statsB = getSlotStats(responses, b.id);

    if (statsB.yes !== statsA.yes) return statsB.yes - statsA.yes;
    if (statsA.no !== statsB.no) return statsA.no - statsB.no;
    return statsB.maybe - statsA.maybe;
  });
}
