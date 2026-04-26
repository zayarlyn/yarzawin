drop table if exists "diary";
drop table if exists "settings";

CREATE TABLE "diary" (
  id CHAR(26) PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE "settings" (
  id CHAR(26) PRIMARY KEY,
  type TEXT NOT NULL CHECK(LENGTH(type) < 40),
  name TEXT NOT NULL CHECK(LENGTH(type) < 40),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
)
