# Deploying the delete-account Edge Function

This function needs your Supabase **service role key**, which must never
appear in browser code — that's why it lives here instead of in `js/`.
You deploy it once via the Supabase CLI; after that it just works.

## One-time setup

1. Install the Supabase CLI (if you don't have it):
   ```
   npm install -g supabase
   ```

2. Log in:
   ```
   supabase login
   ```

3. Link this project folder to your Supabase project (find your project ref
   in your Supabase dashboard URL: `https://supabase.com/dashboard/project/<project-ref>`):
   ```
   supabase link --project-ref <your-project-ref>
   ```

4. Deploy the function:
   ```
   supabase functions deploy delete-account
   ```

That's it — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected into
the function automatically by Supabase at runtime. You do not need to set
them manually.

## Testing it

1. Log in to the app with a real test account
2. Go to `account.html` → Danger Zone → Delete My Account → type `DELETE` → confirm
3. Confirm the account no longer appears under Supabase → Authentication → Users
4. Confirm their rows are gone from the `reflections` and `mood_selections` tables
   (this happens automatically via the `on delete cascade` foreign keys)

## If you ever redeploy the function

Just re-run `supabase functions deploy delete-account` — no other changes
needed.