import { v4 as uuidv4 } from 'uuid';

import type { BaseTimeSlot, DayAvailabilityBlock, PreviewTimeSlot } from './types';

export function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m} ${ampm}`;
}

export function formatTimeShort(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  if (minute === 0) return `${h} ${ampm}`;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export function getBlockDurationMinutes(block: {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}): number {
  const startMinutes = block.startHour * 60 + block.startMinute;
  const endMinutes = block.endHour * 60 + block.endMinute;
  return endMinutes - startMinutes;
}

export function isBlockValidForDuration(
  block: {
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
  },
  durationMinutes: number
): boolean {
  return getBlockDurationMinutes(block) >= durationMinutes;
}

function toTimeLabel(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

export function generateSlotsFromAvailability(
  availabilityBlocks: DayAvailabilityBlock[],
  durationMinutes: number
): PreviewTimeSlot[] {
  const slots: PreviewTimeSlot[] = [];

  for (const block of availabilityBlocks) {
    if (!isBlockValidForDuration(block, durationMinutes)) continue;

    const blockStartMinutes = block.startHour * 60 + block.startMinute;
    const blockEndMinutes = block.endHour * 60 + block.endMinute;

    for (
      let slotStartMin = blockStartMinutes;
      slotStartMin + durationMinutes <= blockEndMinutes;
      slotStartMin += durationMinutes
    ) {
      const slotEndMin = slotStartMin + durationMinutes;
      slots.push({
        id: uuidv4(),
        day: block.date,
        startTime: toTimeLabel(slotStartMin),
        endTime: toTimeLabel(slotEndMin),
      });
    }
  }

  slots.sort((a, b) => {
    if (a.day !== b.day) return a.day.localeCompare(b.day);
    return a.startTime.localeCompare(b.startTime);
  });

  return slots;
}

export function groupSlotsByDate<T extends BaseTimeSlot>(slots: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const slot of slots) {
    const existing = groups.get(slot.day) || [];
    existing.push(slot);
    groups.set(slot.day, existing);
  }

  return groups;
}

export function getBlocksForDate(
  dayAvailability: DayAvailabilityBlock[],
  dateKey: string
): DayAvailabilityBlock[] {
  return dayAvailability.filter((b) => b.date === dateKey);
}

export function countDaysWithAvailability(dayAvailability: DayAvailabilityBlock[]): number {
  const uniqueDates = new Set(dayAvailability.map((b) => b.date));
  return uniqueDates.size;
}

export function getSlotDateRange(slot: BaseTimeSlot): { start: Date; end: Date } {
  const start = new Date(`${slot.day}T${slot.startTime}:00`);
  const end = new Date(`${slot.day}T${slot.endTime}:00`);
  return { start, end };
}

export function formatSlotTime(slot: BaseTimeSlot): string {
  const { start, end } = getSlotDateRange(slot);

  const timeFormat = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${timeFormat.format(start)} – ${timeFormat.format(end)}`;
}

export function formatSlotDate(slot: BaseTimeSlot): string {
  const date = parseDateKey(slot.day);

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
