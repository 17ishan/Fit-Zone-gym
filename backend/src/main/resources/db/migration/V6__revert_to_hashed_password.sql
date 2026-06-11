-- Revert the plaintext-password experiment (V5): go back to BCrypt-hashed passwords stored in a
-- column named `password_hash`. Guarded so it is correct regardless of whether V5 was ever applied:
--   * if the column is currently `password`, rename it back to `password_hash`
--   * if it is already `password_hash` (V5 never ran), do nothing
--
-- NOTE: any password saved while the plaintext build was running is stored as plaintext and will not
-- match BCrypt at login. Those accounts must reset their password (or be re-registered). Accounts
-- that always had a BCrypt hash are unaffected.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = current_schema()
                 AND table_name = 'users' AND column_name = 'password')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = current_schema()
                 AND table_name = 'users' AND column_name = 'password_hash') THEN
        ALTER TABLE users RENAME COLUMN password TO password_hash;
    END IF;
END $$;
