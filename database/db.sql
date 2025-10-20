-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.notification_history (
    id integer NOT NULL DEFAULT nextval('notification_history_id_seq'::regclass),
    user_id uuid,
    title text NOT NULL,
    body text NOT NULL,
    type character varying NOT NULL,
    task_id integer,
    sent_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    clicked_at timestamp with time zone,
    CONSTRAINT notification_history_pkey PRIMARY KEY (id),
    CONSTRAINT notification_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT notification_history_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.notification_preferences (
    id integer NOT NULL DEFAULT nextval('notification_preferences_id_seq'::regclass),
    user_id uuid UNIQUE,
    daily_reminders boolean DEFAULT true,
    deadline_warnings boolean DEFAULT true,
    overdue_alerts boolean DEFAULT true,
    priority_based boolean DEFAULT true,
    reminder_minutes integer DEFAULT 30,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notification_preferences_pkey PRIMARY KEY (id),
    CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text UNIQUE,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.scheduled_notifications (
    id integer NOT NULL DEFAULT nextval('scheduled_notifications_id_seq'::regclass),
    user_id uuid,
    task_id integer,
    notification_type character varying NOT NULL,
    scheduled_for timestamp with time zone NOT NULL,
    sent boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT scheduled_notifications_pkey PRIMARY KEY (id),
    CONSTRAINT scheduled_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    CONSTRAINT scheduled_notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.task_tags (
    id bigint NOT NULL DEFAULT nextval('task_tags_id_seq'::regclass),
    task_id bigint,
    tag_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT task_tags_pkey PRIMARY KEY (id),
    CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);
CREATE TABLE public.tasks (
    id bigint NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
    title text NOT NULL,
    date date NOT NULL,
    due_at timestamp with time zone NULL,
    done boolean DEFAULT false,
    description text,
    status integer DEFAULT 0 CHECK (status = ANY (ARRAY[0, 1, 2])),
    priority text DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
    tags ARRAY DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    order_index integer DEFAULT 0,
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Migration helper (apply in Supabase):
-- ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_at timestamptz NULL;