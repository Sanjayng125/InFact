-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  image_url TEXT,
  is_pro BOOLEAN DEFAULT FALSE,
  credits INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checks table
CREATE TABLE checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_type TEXT NOT NULL CHECK (input_type IN ('text', 'url', 'image', 'video')),
  raw_input TEXT,
  file_url TEXT,
  extracted_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims table
CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id UUID NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
  claim_text TEXT NOT NULL,
  verdict TEXT CHECK (verdict IN ('true', 'false', 'misleading', 'unverified')),
  confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources table
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  title TEXT,
  url TEXT NOT NULL,
  snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
