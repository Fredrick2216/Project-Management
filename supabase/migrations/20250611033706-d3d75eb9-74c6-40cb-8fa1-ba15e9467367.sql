
-- Add the missing category column to the tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'development';

-- Add the missing estimated_hours column if it doesn't exist
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS estimated_hours INTEGER DEFAULT 0;
