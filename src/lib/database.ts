import * as SQLite from 'expo-sqlite';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Types
export type Availability = 'yes' | 'maybe' | 'no';

export interface DayAvailabilityBlock {
  id: string;
  date: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface TimeSlot {
  id: string;
  pollId: string;
  startISO: string;
  endISO: string;
}

export interface Response {
  id: string;
  pollId: string;
  slotId: string;
  participantId: string;
  participantName: string;
  availability: Availability;
  createdAt: string;
}

export interface Poll {
  id: string;
  title: string;
  durationMinutes: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  dayAvailability: DayAvailabilityBlock[];
  status: 'open' | 'finalized';
  finalizedSlotId: string | null;
  createdAt: string;
  creatorId: string;
}

// Database singleton
let db: SQLite.SQLiteDatabase | null = null;

// Initialize database
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('timetogether.db');

  // Create tables
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      date_range_start TEXT NOT NULL,
      date_range_end TEXT NOT NULL,
      day_availability TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      finalized_slot_id TEXT,
      created_at TEXT NOT NULL,
      creator_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS time_slots (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      start_iso TEXT NOT NULL,
      end_iso TEXT NOT NULL,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL,
      slot_id TEXT NOT NULL,
      participant_id TEXT NOT NULL,
      participant_name TEXT NOT NULL,
      availability TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
      FOREIGN KEY (slot_id) REFERENCES time_slots(id) ON DELETE CASCADE,
      UNIQUE(poll_id, slot_id, participant_id)
    );

    CREATE INDEX IF NOT EXISTS idx_slots_poll ON time_slots(poll_id);
    CREATE INDEX IF NOT EXISTS idx_responses_poll ON responses(poll_id);
    CREATE INDEX IF NOT EXISTS idx_responses_slot ON responses(slot_id);
    CREATE INDEX IF NOT EXISTS idx_responses_participant ON responses(participant_id);
  `);

  // Ensure user exists
  const existingUser = await db.getFirstAsync<{ id: string }>('SELECT id FROM user LIMIT 1');
  if (!existingUser) {
    const userId = uuidv4();
    await db.runAsync('INSERT INTO user (id, name) VALUES (?, ?)', [userId, '']);
  }

  return db;
}

// Get database instance
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// User operations
export async function getCurrentUser(): Promise<{ id: string; name: string }> {
  const database = getDatabase();
  const user = await database.getFirstAsync<{ id: string; name: string }>(
    'SELECT id, name FROM user LIMIT 1'
  );
  if (!user) {
    throw new Error('No user found');
  }
  return user;
}

export async function setUserName(name: string): Promise<void> {
  const database = getDatabase();
  await database.runAsync('UPDATE user SET name = ?', [name]);
}

// Poll operations
export async function createPoll(pollData: {
  title: string;
  durationMinutes: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  dayAvailability: DayAvailabilityBlock[];
  timeSlots: Omit<TimeSlot, 'pollId'>[];
}): Promise<string> {
  const database = getDatabase();
  const user = await getCurrentUser();
  const pollId = uuidv4();
  const createdAt = new Date().toISOString();

  await database.withTransactionAsync(async () => {
    // Insert poll
    await database.runAsync(
      `INSERT INTO polls (id, title, duration_minutes, date_range_start, date_range_end, day_availability, status, created_at, creator_id)
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
      [
        pollId,
        pollData.title,
        pollData.durationMinutes,
        pollData.dateRangeStart,
        pollData.dateRangeEnd,
        JSON.stringify(pollData.dayAvailability),
        createdAt,
        user.id,
      ]
    );

    // Insert time slots
    for (const slot of pollData.timeSlots) {
      await database.runAsync(
        'INSERT INTO time_slots (id, poll_id, start_iso, end_iso) VALUES (?, ?, ?, ?)',
        [slot.id, pollId, slot.startISO, slot.endISO]
      );
    }
  });

  return pollId;
}

export async function getPoll(pollId: string): Promise<(Poll & { timeSlots: TimeSlot[]; responses: Response[] }) | null> {
  const database = getDatabase();

  const pollRow = await database.getFirstAsync<{
    id: string;
    title: string;
    duration_minutes: number;
    date_range_start: string;
    date_range_end: string;
    day_availability: string;
    status: string;
    finalized_slot_id: string | null;
    created_at: string;
    creator_id: string;
  }>('SELECT * FROM polls WHERE id = ?', [pollId]);

  if (!pollRow) return null;

  const slots = await database.getAllAsync<{
    id: string;
    poll_id: string;
    start_iso: string;
    end_iso: string;
  }>('SELECT * FROM time_slots WHERE poll_id = ? ORDER BY start_iso', [pollId]);

  const responses = await database.getAllAsync<{
    id: string;
    poll_id: string;
    slot_id: string;
    participant_id: string;
    participant_name: string;
    availability: string;
    created_at: string;
  }>('SELECT * FROM responses WHERE poll_id = ?', [pollId]);

  return {
    id: pollRow.id,
    title: pollRow.title,
    durationMinutes: pollRow.duration_minutes,
    dateRangeStart: pollRow.date_range_start,
    dateRangeEnd: pollRow.date_range_end,
    dayAvailability: JSON.parse(pollRow.day_availability),
    status: pollRow.status as 'open' | 'finalized',
    finalizedSlotId: pollRow.finalized_slot_id,
    createdAt: pollRow.created_at,
    creatorId: pollRow.creator_id,
    timeSlots: slots.map((s) => ({
      id: s.id,
      pollId: s.poll_id,
      startISO: s.start_iso,
      endISO: s.end_iso,
    })),
    responses: responses.map((r) => ({
      id: r.id,
      pollId: r.poll_id,
      slotId: r.slot_id,
      participantId: r.participant_id,
      participantName: r.participant_name,
      availability: r.availability as Availability,
      createdAt: r.created_at,
    })),
  };
}

export async function getAllPolls(): Promise<(Poll & { timeSlots: TimeSlot[]; responses: Response[] })[]> {
  const database = getDatabase();

  const pollRows = await database.getAllAsync<{
    id: string;
    title: string;
    duration_minutes: number;
    date_range_start: string;
    date_range_end: string;
    day_availability: string;
    status: string;
    finalized_slot_id: string | null;
    created_at: string;
    creator_id: string;
  }>('SELECT * FROM polls ORDER BY created_at DESC');

  const polls: (Poll & { timeSlots: TimeSlot[]; responses: Response[] })[] = [];

  for (const pollRow of pollRows) {
    const slots = await database.getAllAsync<{
      id: string;
      poll_id: string;
      start_iso: string;
      end_iso: string;
    }>('SELECT * FROM time_slots WHERE poll_id = ? ORDER BY start_iso', [pollRow.id]);

    const responses = await database.getAllAsync<{
      id: string;
      poll_id: string;
      slot_id: string;
      participant_id: string;
      participant_name: string;
      availability: string;
      created_at: string;
    }>('SELECT * FROM responses WHERE poll_id = ?', [pollRow.id]);

    polls.push({
      id: pollRow.id,
      title: pollRow.title,
      durationMinutes: pollRow.duration_minutes,
      dateRangeStart: pollRow.date_range_start,
      dateRangeEnd: pollRow.date_range_end,
      dayAvailability: JSON.parse(pollRow.day_availability),
      status: pollRow.status as 'open' | 'finalized',
      finalizedSlotId: pollRow.finalized_slot_id,
      createdAt: pollRow.created_at,
      creatorId: pollRow.creator_id,
      timeSlots: slots.map((s) => ({
        id: s.id,
        pollId: s.poll_id,
        startISO: s.start_iso,
        endISO: s.end_iso,
      })),
      responses: responses.map((r) => ({
        id: r.id,
        pollId: r.poll_id,
        slotId: r.slot_id,
        participantId: r.participant_id,
        participantName: r.participant_name,
        availability: r.availability as Availability,
        createdAt: r.created_at,
      })),
    });
  }

  return polls;
}

export async function getMyPolls(): Promise<(Poll & { timeSlots: TimeSlot[]; responses: Response[] })[]> {
  const user = await getCurrentUser();
  const allPolls = await getAllPolls();
  return allPolls.filter((p) => p.creatorId === user.id);
}

export async function getRespondedPolls(): Promise<(Poll & { timeSlots: TimeSlot[]; responses: Response[] })[]> {
  const user = await getCurrentUser();
  const allPolls = await getAllPolls();
  return allPolls.filter(
    (p) => p.creatorId !== user.id && p.responses.some((r) => r.participantId === user.id)
  );
}

export async function addResponse(
  pollId: string,
  slotId: string,
  availability: Availability,
  participantName?: string
): Promise<void> {
  const database = getDatabase();
  const user = await getCurrentUser();
  const responseId = uuidv4();
  const createdAt = new Date().toISOString();
  const name = participantName || user.name || 'Anonymous';

  // Upsert response
  await database.runAsync(
    `INSERT INTO responses (id, poll_id, slot_id, participant_id, participant_name, availability, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(poll_id, slot_id, participant_id) DO UPDATE SET
       availability = excluded.availability,
       participant_name = excluded.participant_name`,
    [responseId, pollId, slotId, user.id, name, availability, createdAt]
  );
}

export async function finalizePoll(pollId: string, slotId: string): Promise<void> {
  const database = getDatabase();
  await database.runAsync(
    'UPDATE polls SET status = ?, finalized_slot_id = ? WHERE id = ?',
    ['finalized', slotId, pollId]
  );
}

export async function deletePoll(pollId: string): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM polls WHERE id = ?', [pollId]);
}

// Migration helper: Import from AsyncStorage/Zustand
export async function migrateFromZustand(zustandData: {
  polls: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    dateRangeStart: string;
    dateRangeEnd: string;
    dayAvailability: DayAvailabilityBlock[];
    timeSlots: { id: string; startISO: string; endISO: string }[];
    responses: { participantId: string; participantName: string; slotId: string; availability: Availability }[];
    status: 'open' | 'finalized';
    finalizedSlotId?: string;
    createdAt: string;
    creatorId: string;
  }>;
  currentUserId: string;
  currentUserName: string;
}): Promise<void> {
  const database = getDatabase();

  await database.withTransactionAsync(async () => {
    // Update user
    await database.runAsync('UPDATE user SET id = ?, name = ?', [
      zustandData.currentUserId,
      zustandData.currentUserName,
    ]);

    // Migrate each poll
    for (const poll of zustandData.polls) {
      // Check if poll already exists
      const existing = await database.getFirstAsync<{ id: string }>(
        'SELECT id FROM polls WHERE id = ?',
        [poll.id]
      );
      if (existing) continue;

      // Insert poll
      await database.runAsync(
        `INSERT INTO polls (id, title, duration_minutes, date_range_start, date_range_end, day_availability, status, finalized_slot_id, created_at, creator_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          poll.id,
          poll.title,
          poll.durationMinutes,
          poll.dateRangeStart,
          poll.dateRangeEnd,
          JSON.stringify(poll.dayAvailability),
          poll.status,
          poll.finalizedSlotId || null,
          poll.createdAt,
          poll.creatorId,
        ]
      );

      // Insert time slots
      for (const slot of poll.timeSlots) {
        await database.runAsync(
          'INSERT INTO time_slots (id, poll_id, start_iso, end_iso) VALUES (?, ?, ?, ?)',
          [slot.id, poll.id, slot.startISO, slot.endISO]
        );
      }

      // Insert responses
      for (const response of poll.responses) {
        const responseId = uuidv4();
        await database.runAsync(
          `INSERT INTO responses (id, poll_id, slot_id, participant_id, participant_name, availability, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(poll_id, slot_id, participant_id) DO NOTHING`,
          [
            responseId,
            poll.id,
            response.slotId,
            response.participantId,
            response.participantName,
            response.availability,
            poll.createdAt,
          ]
        );
      }
    }
  });
}
