ALTER TABLE "diary" RENAME TO "post";

ALTER TABLE public."post"
  ADD COLUMN feature TEXT NOT NULL DEFAULT 'diary' CHECK( feature IN ('diary', 'blog', 'note') );

ALTER TABLE public."post"
  ALTER COLUMN feature DROP DEFAULT;
