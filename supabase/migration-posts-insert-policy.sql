-- Allow service role to insert posts
create policy "Service role insert posts"
  on posts for insert
  with check (auth.role() = 'service_role');

-- Allow service role to update posts
create policy "Service role update posts"
  on posts for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Allow service role to delete posts
create policy "Service role delete posts"
  on posts for delete
  using (auth.role() = 'service_role');
