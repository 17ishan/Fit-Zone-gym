# Supabase Database Schema Update

## Required Changes

To support the new membership purchase feature, you need to add two columns to the `users` table in your Supabase database.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Select the `users` table
4. Click **"+ New Column"** and add the following columns:

### Column 1: address
- **Name**: `address`
- **Type**: `text`
- **Default value**: (leave empty)
- **Is Nullable**: ✅ Yes (checked)
- **Is Unique**: ❌ No
- **Is Primary Key**: ❌ No

### Column 2: age
- **Name**: `age`
- **Type**: `int4` (integer)
- **Default value**: (leave empty)
- **Is Nullable**: ✅ Yes (checked)
- **Is Unique**: ❌ No
- **Is Primary Key**: ❌ No

4. Click **Save** for each column

## Option 2: Using SQL Editor

Alternatively, you can run this SQL query in the Supabase SQL Editor:

```sql
-- Add address column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add age column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS age INTEGER;

-- Optional: Add comments to document the columns
COMMENT ON COLUMN users.address IS 'Customer full address';
COMMENT ON COLUMN users.age IS 'Customer age (must be 16-100)';
```

## Verification

After adding the columns, verify by running:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
```

You should see `address` (text) and `age` (integer) in the list.

## Expected Schema

After the update, your `users` table should have at least these columns:

| Column Name | Data Type | Nullable | Description |
|-------------|-----------|----------|-------------|
| id          | uuid      | No       | Primary key (auto-generated) |
| name        | text      | Yes      | Customer full name |
| email       | text      | Yes      | Customer email address |
| phone       | text      | Yes      | Customer phone number |
| address     | text      | Yes      | Customer full address (NEW) |
| age         | integer   | Yes      | Customer age (NEW) |
| created_at  | timestamp | Yes      | Record creation timestamp |

## Testing After Update

Once you've added the columns:

1. Refresh your application page
2. Try purchasing a membership again
3. The purchase should now complete successfully
4. Check the Supabase Table Editor to see the new customer data with address and age fields populated

## Note

The columns are marked as nullable (optional) in the database to maintain backward compatibility, but the application form requires them to be filled in before submission.
