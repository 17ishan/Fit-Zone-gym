-- Seed the membership plans that were previously hardcoded in the user frontend
-- (frontend MembershipSection.tsx). Prices are in minor units (paise).

INSERT INTO plans (name, price_minor, duration_months, features, popular, active, sort_order, created_at, updated_at)
VALUES
    ('Basic', 79900, 1,
     '["Access to gym floor", "Locker room access", "1 Personal Trainer session"]'::jsonb,
     false, true, 1, now(), now()),

    ('Standard', 149900, 1,
     '["Everything in Basic", "Group fitness classes", "Diet consultation", "4 PT sessions/month"]'::jsonb,
     true, true, 2, now(), now()),

    ('Premium', 249900, 1,
     '["Everything in Standard", "Unlimited PT sessions", "Massage & recovery zone", "Priority support"]'::jsonb,
     false, true, 3, now(), now()),

    ('Annual Elite', 2499900, 12,
     '["Unlimited gym access", "Unlimited PT sessions", "Spa & recovery access", "Exclusive VIP events", "Dedicated nutritionist"]'::jsonb,
     false, true, 4, now(), now());
