-- Store the login password as readable plaintext instead of a BCrypt hash, and rename the
-- column to match. Requested for a local/learning setup so the password is visible in the
-- users table when browsing it (e.g. in DBeaver).
--
-- WARNING: storing plaintext passwords is insecure and must NEVER be used in production. Any
-- read access to this table exposes every user's real password. Revert to hashing (BCrypt /
-- Argon2) before deploying anywhere real.
ALTER TABLE users RENAME COLUMN password_hash TO password;
