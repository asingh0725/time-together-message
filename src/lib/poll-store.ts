import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Types
export type Availability = 'yes' | 'maybe' | 'no';

// NEW: Day-specific availability block
export interface DayAvailabilityBlock {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startHour: number; // 0-23
  startMinute: number; // 0-59
  endHour: number; // 0-23
  endMinute: number; // 0-59
}

// Legacy type for backwards compatibility
export interface AvailabilityBlock {
  id: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface TimeSlot {
  id: string;
  startISO: string;
  endISO: string;
  hasConflict?: boolean;
}

export interface Response {
  participantId: string;
  participantName: string;
  slotId: string;
  availability: Availability;
}

export interface Poll {
  id: string;
  title: string;
  durationMinutes: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  // NEW: Day-specific availability
  dayAvailability: DayAvailabilityBlock[];
  timeSlots: TimeSlot[];
  responses: Response[];
  status: 'open' | 'finalized';
  finalizedSlotId?: string;
  createdAt: string;
  creatorId: string;
}

interface PollStore {
  polls: Poll[];
  currentUserId: string;
  currentUserName: string;

  createPoll: (poll: Omit<Poll, 'id' | 'createdAt' | 'creatorId' | 'responses' | 'status'>) => string;
  getPoll: (id: string) => Poll | undefined;
  addResponse: (pollId: string, slotId: string, availability: Availability, participantName?: string) => void;
  updateResponse: (pollId: string, slotId: string, availability: Availability) => void;
  finalizePoll: (pollId: string, slotId: string) => void;
  deletePoll: (pollId: string) => void;
  setUserName: (name: string) => void;

  getMyPolls: () => Poll[];
  getRespondedPolls: () => Poll[];
}

export const usePollStore = create<PollStore>()(
  persist(
    (set, get) => ({
      polls: [],
      currentUserId: uuidv4(),
      currentUserName: '',

      createPoll: (pollData) => {
        const id = uuidv4();
        const newPoll: Poll = {
          ...pollData,
          id,
          createdAt: new Date().toISOString(),
          creatorId: get().currentUserId,
          responses: [],
          status: 'open',
        };
        set((state) => ({ polls: [...state.polls, newPoll] }));
        return id;
      },

      getPoll: (id) => {
        return get().polls.find((p) => p.id === id);
      },

      addResponse: (pollId, slotId, availability, participantName) => {
        const { currentUserId, currentUserName } = get();
        set((state) => ({
          polls: state.polls.map((poll) => {
            if (poll.id !== pollId) return poll;

            const existingIndex = poll.responses.findIndex(
              (r) => r.participantId === currentUserId && r.slotId === slotId
            );

            if (existingIndex >= 0) {
              const newResponses = [...poll.responses];
              newResponses[existingIndex] = {
                ...newResponses[existingIndex],
                availability,
              };
              return { ...poll, responses: newResponses };
            }

            return {
              ...poll,
              responses: [
                ...poll.responses,
                {
                  participantId: currentUserId,
                  participantName: participantName || currentUserName || 'Anonymous',
                  slotId,
                  availability,
                },
              ],
            };
          }),
        }));
      },

      updateResponse: (pollId, slotId, availability) => {
        get().addResponse(pollId, slotId, availability);
      },

      finalizePoll: (pollId, slotId) => {
        set((state) => ({
          polls: state.polls.map((poll) =>
            poll.id === pollId
              ? { ...poll, status: 'finalized', finalizedSlotId: slotId }
              : poll
          ),
        }));
      },

      deletePoll: (pollId) => {
        set((state) => ({
          polls: state.polls.filter((p) => p.id !== pollId),
        }));
      },

      setUserName: (name) => {
        set({ currentUserName: name });
      },

      getMyPolls: () => {
        const { polls, currentUserId } = get();
        return polls.filter((p) => p.creatorId === currentUserId);
      },

      getRespondedPolls: () => {
        const { polls, currentUserId } = get();
        return polls.filter(
          (p) =>
            p.creatorId !== currentUserId &&
            p.responses.some((r) => r.participantId === currentUserId)
        );
      },
    }),
    {
      name: 'timetogether-polls',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper: Get date key from Date object (YYYY-MM-DD)
export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper: Parse date key back to Date
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Helper: Get block duration in minutes
export function getBlockDurationMinutes(block: { startHour: number; startMinute: number; endHour: number; endMinute: number }): number {
  const startMinutes = block.startHour * 60 + block.startMinute;
  const endMinutes = block.endHour * 60 + block.endMinute;
  return endMinutes - startMinutes;
}

// Helper: Check if block is valid for a given duration
export function isBlockValidForDuration(block: { startHour: number; startMinute: number; endHour: number; endMinute: number }, durationMinutes: number): boolean {
  return getBlockDurationMinutes(block) >= durationMinutes;
}

// Helper: Format time from hour/minute
export function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

// Helper: Format time short (no minutes if :00)
export function formatTimeShort(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  if (minute === 0) return `${h} ${ampm}`;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

// Generate time slots from day-specific availability blocks
export function generateTimeSlotsFromDayAvailability(
  dayAvailability: DayAvailabilityBlock[],
  durationMinutes: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (const block of dayAvailability) {
    // Skip blocks too short for duration
    if (!isBlockValidForDuration(block, durationMinutes)) continue;

    const date = parseDateKey(block.date);
    const blockStartMinutes = block.startHour * 60 + block.startMinute;
    const blockEndMinutes = block.endHour * 60 + block.endMinute;

    // Generate slots within this block
    for (let slotStartMin = blockStartMinutes; slotStartMin + durationMinutes <= blockEndMinutes; slotStartMin += durationMinutes) {
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(slotStartMin / 60), slotStartMin % 60, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

      slots.push({
        id: uuidv4(),
        startISO: slotStart.toISOString(),
        endISO: slotEnd.toISOString(),
      });
    }
  }

  // Sort by start time
  slots.sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());

  return slots;
}

// Group slots by date
export function groupSlotsByDate(slots: TimeSlot[]): Map<string, TimeSlot[]> {
  const groups = new Map<string, TimeSlot[]>();

  for (const slot of slots) {
    const dateKey = getDateKey(new Date(slot.startISO));
    const existing = groups.get(dateKey) || [];
    existing.push(slot);
    groups.set(dateKey, existing);
  }

  return groups;
}

// Get availability blocks for a specific date
export function getBlocksForDate(dayAvailability: DayAvailabilityBlock[], dateKey: string): DayAvailabilityBlock[] {
  return dayAvailability.filter((b) => b.date === dateKey);
}

// Count days with availability
export function countDaysWithAvailability(dayAvailability: DayAvailabilityBlock[]): number {
  const uniqueDates = new Set(dayAvailability.map((b) => b.date));
  return uniqueDates.size;
}

export function getSlotStats(poll: Poll, slotId: string) {
  const responses = poll.responses.filter((r) => r.slotId === slotId);
  return {
    yes: responses.filter((r) => r.availability === 'yes').length,
    maybe: responses.filter((r) => r.availability === 'maybe').length,
    no: responses.filter((r) => r.availability === 'no').length,
    total: responses.length,
  };
}

export function rankSlots(poll: Poll): TimeSlot[] {
  return [...poll.timeSlots].sort((a, b) => {
    const statsA = getSlotStats(poll, a.id);
    const statsB = getSlotStats(poll, b.id);

    if (statsB.yes !== statsA.yes) return statsB.yes - statsA.yes;
    if (statsA.no !== statsB.no) return statsA.no - statsB.no;
    return statsB.maybe - statsA.maybe;
  });
}

export function formatSlotTime(slot: TimeSlot): string {
  const start = new Date(slot.startISO);
  const end = new Date(slot.endISO);

  const timeFormat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${timeFormat.format(start)} – ${timeFormat.format(end)}`;
}

export function formatSlotDate(slot: TimeSlot): string {
  const date = new Date(slot.startISO);

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateHeader(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
