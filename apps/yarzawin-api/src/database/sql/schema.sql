drop table if exists "diary";
drop table if exists "setting";

CREATE TABLE "diary" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE "setting" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL CHECK(LENGTH(type) < 40), -- sub-app
  type TEXT NOT NULL CHECK(LENGTH(type) < 40), 
  name TEXT NOT NULL CHECK(LENGTH(type) < 40),
  value JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE("feature", "type", "name")
); 
