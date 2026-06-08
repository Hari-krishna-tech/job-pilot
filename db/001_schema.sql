-- 001_schema.sql
-- JobPilot database schema — Phase 1 Foundation

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE RESTRICT,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text,
  years_experience integer,
  skills text[] DEFAULT '{}',
  industries text[] DEFAULT '{}',
  work_experience jsonb,
  education jsonb,
  job_titles_seeking text[] DEFAULT '{}',
  remote_preference text,
  preferred_locations text[] DEFAULT '{}',
  salary_expectation text,
  cover_letter_tone text,
  linkedin_url text,
  portfolio_url text,
  work_authorization text,
  resume_pdf_url text,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- agent_runs
CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'running',
  job_title_searched text,
  location_searched text,
  jobs_found integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_runs_select_own" ON agent_runs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agent_runs_insert_own" ON agent_runs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "agent_runs_update_own" ON agent_runs FOR UPDATE USING (auth.uid() = user_id);

-- jobs
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  source text NOT NULL CHECK (source IN ('search', 'url')),
  source_url text,
  external_apply_url text,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  salary text,
  job_type text,
  about_role text,
  responsibilities text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  nice_to_have text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  about_company text,
  match_score integer,
  match_reason text,
  matched_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  company_research jsonb,
  found_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select_own" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "jobs_insert_own" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "jobs_update_own" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "jobs_delete_own" ON jobs FOR DELETE USING (auth.uid() = user_id);

-- agent_logs
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  message text NOT NULL,
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info', 'success', 'warning', 'error')),
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agent_logs_select_own" ON agent_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "agent_logs_insert_own" ON agent_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
