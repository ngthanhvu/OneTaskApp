-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequences
CREATE SEQUENCE IF NOT EXISTS notification_history_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS notification_preferences_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS scheduled_notifications_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS task_tags_id_seq START 1;
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq START 1;

-- Tables
CREATE TABLE IF NOT EXISTS public.tasks (
    id bigint PRIMARY KEY DEFAULT nextval('tasks_id_seq'::regclass),
    title text NOT NULL,
    date date NOT NULL,
    due_at timestamptz NULL,
    done boolean DEFAULT false,
    description text,
    status integer DEFAULT 0 CHECK (status = ANY (ARRAY[0, 1, 2])),
    priority text DEFAULT 'medium' CHECK (priority = ANY (ARRAY['low', 'medium', 'high'])),
    tags text[] DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_id uuid REFERENCES auth.users(id),
    order_index integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.notification_history (
    id integer PRIMARY KEY DEFAULT nextval('notification_history_id_seq'::regclass),
    user_id uuid REFERENCES auth.users(id),
    title text NOT NULL,
    body text NOT NULL,
    type varchar NOT NULL,
    task_id integer REFERENCES public.tasks(id),
    sent_at timestamptz DEFAULT now(),
    read_at timestamptz,
    clicked_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id integer PRIMARY KEY DEFAULT nextval('notification_preferences_id_seq'::regclass),
    user_id uuid UNIQUE REFERENCES auth.users(id),
    daily_reminders boolean DEFAULT true,
    deadline_warnings boolean DEFAULT true,
    overdue_alerts boolean DEFAULT true,
    priority_based boolean DEFAULT true,
    reminder_minutes integer DEFAULT 30,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    username text UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
    id integer PRIMARY KEY DEFAULT nextval('scheduled_notifications_id_seq'::regclass),
    user_id uuid REFERENCES auth.users(id),
    task_id integer REFERENCES public.tasks(id),
    notification_type varchar NOT NULL,
    scheduled_for timestamptz NOT NULL,
    sent boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_tags (
    id bigint PRIMARY KEY DEFAULT nextval('task_tags_id_seq'::regclass),
    task_id bigint REFERENCES public.tasks(id),
    tag_name text NOT NULL,
    created_at timestamptz DEFAULT now()
);
