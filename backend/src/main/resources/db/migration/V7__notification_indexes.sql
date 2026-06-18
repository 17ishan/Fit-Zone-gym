-- Indexes supporting the scheduled notification jobs.
-- The daily jobs scan memberships by end_date (+status) and payments by status (+created_at);
-- the base schema only indexed memberships.status, so these avoid full-table scans.

CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships (end_date);
CREATE INDEX IF NOT EXISTS idx_memberships_status_end_date ON memberships (status, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_status_created_at ON payments (status, created_at);
