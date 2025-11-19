-- Update user subscription from completed Stripe checkout
-- Run this in your PostgreSQL/Supabase SQL editor

UPDATE "User"
SET 
  "stripeCustomerId" = 'cus_TFjWz3gV4jVICY',
  "stripeSubscriptionId" = 'sub_1SJEC4LeUnkj1iM4jXoC8s01',
  "plan" = 'PRO',
  "updatedAt" = NOW()
WHERE id = 'ec4172be-8c33-4c6f-8fcb-d6ebac5e48ea';

-- Verify the update
SELECT id, email, plan, "stripeCustomerId", "stripeSubscriptionId"
FROM "User"
WHERE id = 'ec4172be-8c33-4c6f-8fcb-d6ebac5e48ea';
