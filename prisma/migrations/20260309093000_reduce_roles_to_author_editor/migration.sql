ALTER TYPE "UserRole" RENAME TO "UserRole_old";

CREATE TYPE "UserRole" AS ENUM ('author', 'editor');

ALTER TABLE "Profile"
ALTER COLUMN "primaryRole" TYPE "UserRole"
USING (
  CASE
    WHEN lower("email") = 'azzoucharef3@gmail.com' THEN 'editor'::"UserRole"
    WHEN "primaryRole"::text = 'editor' THEN 'editor'::"UserRole"
    ELSE 'author'::"UserRole"
  END
);

DROP TYPE "UserRole_old";
