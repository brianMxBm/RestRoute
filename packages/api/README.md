@RestRoute/api

Refer here for [Supabase CLI documentation](https://supabase.com/docs/reference/cli/global-flags)

Ask for an invite to the RestRoute organization on Supabase. Ask @brianMxBm

## Steps To Generate Types.

1. cd to [/packages/api/supabase](https://github.com/MoggerInc/moggerbun/tree/main/packages/api/supabase) directory.

2. Run `npx supabase login` to authenticate your supabase session.

3. Run `npx supabase link` to link the local development project to a remote project. Select the RestRoute project.


OR

1. Run `./utils/scripts/types.sh` to generate the types.


Types should now be present in [/packages/api/supabase/types/database.types.ts](https://github.com/MoggerInc/moggerbun/tree/main/packages/api/supabase/types/database.types.ts)
