# 🚀 SIMPLE FIX - Add Database Columns (5 Minutes)

## The Problem
Your Supabase `users` table is missing two columns: `address` and `age`

## The Solution (Choose ONE method)

---

## ⚡ METHOD 1: Using Supabase Dashboard (EASIEST)

### Step 1: Open Your Project
1. Go to: https://supabase.com/dashboard
2. Click on your **organization**
3. Click on your **gym website project**

### Step 2: Go to Table Editor
1. In the left sidebar, click **"Table Editor"** (looks like a table icon 📊)
2. Click on the **"users"** table from the list

### Step 3: Add "address" Column
1. Look for a **"+"** button or **"Add Column"** button (usually top-right)
2. Click it
3. Fill in:
   - **Name**: `address`
   - **Type**: `text` (select from dropdown)
   - **Nullable**: ✅ **CHECK THIS BOX** (very important!)
   - Leave everything else as default
4. Click **"Save"** or **"Confirm"**

### Step 4: Add "age" Column
1. Click the **"+"** or **"Add Column"** button again
2. Fill in:
   - **Name**: `age`
   - **Type**: `int4` or `integer` (select from dropdown)
   - **Nullable**: ✅ **CHECK THIS BOX** (very important!)
   - Leave everything else as default
3. Click **"Save"** or **"Confirm"**

### Step 5: Verify
- You should now see `address` and `age` columns in your users table
- Done! ✅

---

## ⚡ METHOD 2: Using SQL (FASTER)

### Step 1: Open SQL Editor
1. In your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar (looks like </> icon)
3. Click **"New Query"**

### Step 2: Run This SQL
Copy and paste this code:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER;
```

### Step 3: Execute
1. Click the **"Run"** button (or press `Ctrl+Enter`)
2. You should see: **"Success. No rows returned"**
3. Done! ✅

---

## ✅ After Adding Columns

1. Go back to your website: http://localhost:5173
2. Scroll to membership section
3. Click **"Join"** on any plan
4. Fill in the form
5. Complete the purchase
6. Go to Supabase → Table Editor → users table
7. **You should now see the customer data!** 🎉

---

## 🆘 Still Having Issues?

If you see an error after adding the columns:
1. Refresh your browser on the gym website
2. Try the purchase again
3. Check the browser console (F12) for any error messages

---

## 📸 What It Should Look Like

After adding the columns, your `users` table should have these columns:
- `id` (uuid)
- `name` (text)
- `email` (text)
- `phone` (text)
- **`address` (text)** ← NEW
- **`age` (integer)** ← NEW
- `created_at` (timestamp)

That's it! The feature will work perfectly after this. 🚀
