drop table if exists "diary";
drop table if exists "setting";
drop table if exists "user";

CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

INSERT INTO "user" (id, username, display_name, password_hash) VALUES ('4791bbfb-57fe-4f05-a001-8c0762494187','test', 'Test User', '$2b$10$YeKTUg03yv7qoRUXOTt1c.2RGuXe3WiakXnK4kThrQxGF.CvcZh.i'); -- password: "password"

CREATE TABLE "diary" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,

  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE "setting" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature TEXT NOT NULL CHECK( feature IN ('diary') ), -- sub-app
  type TEXT NOT NULL CHECK(LENGTH(type) < 40), 
  name TEXT NOT NULL CHECK(LENGTH(type) < 40),
  value JSONB NOT NULL,

  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  UNIQUE("feature", "type", "name", "user_id")
); 

CREATE TABLE "object" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,

  entity_name TEXT NOT NULL,
  entity_id TEXT NOT NULL, 

  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);