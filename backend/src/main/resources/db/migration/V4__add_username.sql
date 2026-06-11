-- Add a unique username. Nullable so existing Google-only accounts (created without one) stay valid;
-- new email/password signups always set it. Postgres allows multiple NULLs under a UNIQUE constraint.

ALTER TABLE users ADD COLUMN username varchar(50);
ALTER TABLE users ADD CONSTRAINT uq_users_username UNIQUE (username);
