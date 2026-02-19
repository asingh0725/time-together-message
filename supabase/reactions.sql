-- Reactions table for finalized polls.
-- Run in Supabase SQL editor.

CREATE TABLE IF NOT EXISTS reactions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id     text        NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  session_id  text        NOT NULL,
  emoji       text        NOT NULL,
  comment     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, session_id)
);

ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Anyone can read reactions
CREATE POLICY "reactions_select_all" ON reactions
  FOR SELECT USING (true);

-- Anyone can insert a reaction (one per session per poll via unique constraint)
CREATE POLICY "reactions_insert" ON reactions
  FOR INSERT WITH CHECK (true);

-- Session owner can update their own reaction
CREATE POLICY "reactions_update_self" ON reactions
  FOR UPDATE
  USING (session_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'session_id'))
  WITH CHECK (session_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'session_id'));
