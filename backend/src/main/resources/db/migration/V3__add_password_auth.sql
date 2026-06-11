-- Email/password authentication: optional password on users + reset-token table.
-- password_hash is nullable so existing Google-only accounts keep working.

ALTER TABLE users ADD COLUMN password_hash varchar(255);

CREATE TABLE password_reset_tokens (
    id         uuid PRIMARY KEY,
    user_id    uuid                     NOT NULL,
    token_hash varchar(255)             NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used       boolean                  NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_prt_token_hash UNIQUE (token_hash)
);

CREATE INDEX idx_prt_user_id ON password_reset_tokens (user_id);
