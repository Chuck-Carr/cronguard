-- IMPORTANT: Run this AFTER applying add-pause-and-tags.sql
-- This migration ensures existing monitors continue to receive alerts
-- by adding the user's account email to the alertEmails field

-- For monitors with no alertEmails set, use the user's email
UPDATE "Monitor" m
SET "alertEmails" = u.email
FROM "User" u
WHERE m."userId" = u.id 
  AND (m."alertEmails" IS NULL OR m."alertEmails" = '');

-- For monitors that already have alertEmails, prepend the user's email
-- (only if the user's email is not already in the list)
UPDATE "Monitor" m
SET "alertEmails" = u.email || ',' || m."alertEmails"
FROM "User" u
WHERE m."userId" = u.id 
  AND m."alertEmails" IS NOT NULL 
  AND m."alertEmails" != ''
  AND m."alertEmails" NOT LIKE '%' || u.email || '%';

-- Verify the changes
SELECT 
  m.id, 
  m.name, 
  u.email as "userEmail", 
  m."alertEmails"
FROM "Monitor" m
JOIN "User" u ON m."userId" = u.id
ORDER BY m."createdAt" DESC
LIMIT 10;
