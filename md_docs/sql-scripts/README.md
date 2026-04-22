# SQL Scripts Directory

This directory contains ad-hoc SQL scripts used for data management and migrations outside of the standard Supabase migration flow.

## Contents

### Event Management Scripts

- **`add_all_events_with_real_images.sql`** - Comprehensive script to add events with real She Rises event images
- **`add_more_events_now.sql`** - Additional events insertion script
- **`update_images_now.sql`** - Script to update event images

## Usage

These scripts are intended to be run manually against the Supabase database when needed. They are kept separate from the automated migration system in `supabase/migrations/`.

### Running Scripts

```bash
# Using Supabase CLI
npx supabase db execute --file sql-scripts/filename.sql

# Or via Supabase Dashboard
# Copy and paste the SQL content into the SQL Editor
```

## Organization

- **Standard Migrations:** `supabase/migrations/` - Automated, version-controlled migrations
- **Ad-hoc Scripts:** `sql-scripts/` - Manual scripts for one-time operations

## Best Practices

1. Test scripts on a development/staging database first
2. Back up data before running scripts that modify or delete records
3. Document any scripts that become part of regular workflows
4. Consider moving frequently-used scripts into proper migrations

---

**Note:** For new database schema changes, use `npx supabase migration new <name>` to create proper migrations in the `supabase/migrations/` directory.
