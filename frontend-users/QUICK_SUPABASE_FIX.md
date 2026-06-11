# Quick Guide: Add Columns to Supabase Users Table

## Step-by-Step Instructions

### 1. Navigate to Table Editor
1. In your Supabase dashboard, click on **"Table Editor"** in the left sidebar
2. Select the **"users"** table from the list

### 2. Add "address" Column
1. Click the **"+"** button (or "New Column" button) at the top right
2. Fill in the details:
   - **Name**: `address`
   - **Type**: Select `text` from the dropdown
   - **Default Value**: Leave empty
   - **Is Nullable**: ✅ Check this box (important!)
   - **Is Unique**: Leave unchecked
   - **Is Primary Key**: Leave unchecked
3. Click **"Save"** or **"Add Column"**

### 3. Add "age" Column
1. Click the **"+"** button again
2. Fill in the details:
   - **Name**: `age`
   - **Type**: Select `int4` or `integer` from the dropdown
   - **Default Value**: Leave empty
   - **Is Nullable**: ✅ Check this box (important!)
   - **Is Unique**: Leave unchecked
   - **Is Primary Key**: Leave unchecked
3. Click **"Save"** or **"Add Column"**

### 4. Verify
- You should now see both `address` and `age` columns in your users table
- The table should show these columns alongside your existing columns (id, name, email, phone, etc.)

### 5. Test
1. Go back to your gym website: http://localhost:5173
2. Scroll to the membership section
3. Click "Join" on any plan
4. Fill in the customer details form
5. Complete the purchase
6. Go back to Supabase Table Editor → users table
7. You should now see the customer data with address and age!

---

## Alternative: Use SQL Editor (If you prefer SQL)

1. In Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Paste this SQL:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER;
```

4. Click **"Run"** or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

That's it! Now test the membership purchase again.
