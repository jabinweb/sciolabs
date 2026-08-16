ALTER TABLE "User" ADD COLUMN IF NOT EXISTS desk_status TEXT NOT NULL DEFAULT 'online';

ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_assignee_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'ticket_messages' AND column_name = 'author_id'
      AND udt_name = 'uuid'
  ) THEN
    ALTER TABLE ticket_messages ALTER COLUMN author_id TYPE TEXT USING author_id::text;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'agents'
  ) THEN
    ALTER TABLE tickets ADD COLUMN IF NOT EXISTS assignee_user_id TEXT;

    UPDATE tickets t
    SET assignee_user_id = u.id
    FROM agents a
    JOIN "User" u ON lower(u.email) = lower(a.email)
    WHERE t.assignee_id IS NOT NULL AND t.assignee_id::text = a.id::text;

    ALTER TABLE tickets DROP COLUMN IF EXISTS assignee_id;
    ALTER TABLE tickets RENAME COLUMN assignee_user_id TO assignee_id;

    UPDATE ticket_messages m
    SET author_id = u.id
    FROM agents a
    JOIN "User" u ON lower(u.email) = lower(a.email)
    WHERE m.author_type = 'agent' AND m.author_id IS NOT NULL AND m.author_id = a.id::text;

    DROP TABLE IF EXISTS agents CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'tickets' AND column_name = 'assignee_id'
      AND udt_name = 'uuid'
  ) THEN
    ALTER TABLE tickets ALTER COLUMN assignee_id TYPE TEXT USING NULL;
  END IF;
END $$;

UPDATE tickets
SET assignee_id = NULL
WHERE assignee_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "User" u WHERE u.id = tickets.assignee_id);

ALTER TABLE tickets
  ADD CONSTRAINT tickets_assignee_id_fkey
  FOREIGN KEY (assignee_id) REFERENCES "User"(id) ON DELETE SET NULL;

DROP TABLE IF EXISTS roadmap_votes CASCADE;
DROP TABLE IF EXISTS roadmap_items CASCADE;
