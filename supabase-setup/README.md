# Supabase Setup Folder

This folder contains all files needed to set up your Supabase backend.

## Files

- **`supabase_setup.sql`** - SQL script to create all database tables
- **`SETUP_INSTRUCTIONS.md`** - Step-by-step guide to set up Supabase

## Quick Start

1. Follow the instructions in `SETUP_INSTRUCTIONS.md`
2. Run `supabase_setup.sql` in Supabase SQL Editor
3. Add the required secrets to Supabase Edge Functions

## Database Schema

### Tables Created:
- **users** - Stores user information (email)
- **licenses** - Stores license keys linked to users
- **payments** - Tracks Stripe payment transactions

All tables have proper indexes for optimal query performance.
