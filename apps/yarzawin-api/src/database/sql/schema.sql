CREATE TABLE "diary" (
  id CHAR(26) PRIMARY KEY,
  title TEXT DEFAULT NOW();
  content TEXT;
)
