# Prerequisites for running our database locally.

Refer here for [Supabase CLI documentation](https://supabase.com/docs/reference/cli/global-flags)

Refer here for [Prisma CLI documentation](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

Ensure that you have [Docker](https://docs.docker.com/engine/install/) installed on your machine and ensure it's running.

Ask for an invite to the Mogger organization on Supabase. Ask @brianMxBm

## Steps To Start DB

0. (Optional) Run `npx supabase reset` to recreate the local db container, it'll also apply any local migrations in the [supabase/migrations](https://github.com/MoggerInc/moggerbun/tree/main/packages/api/supabase/migrations) directory.

1. cd to [/packages/api/supabase](https://github.com/MoggerInc/moggerbun/tree/main/packages/api/supabase) directory.

2. Run `npx supabase login` to authenticate your supabase session

3. Run `npx supabase link` to link the local development project to a remote project. Select the Mogger project.

4. Run `npx supabasse db pull` to pulls schema changes to the prod database. A new migration file will be created under supabase/migrations directory. Keep this up to date. I'm looking into github actions to run this periodically to ensure our local db instances stay synced.

5. Run `npx supabase start` to start the local dev stack.

## Steps To Generate Types
