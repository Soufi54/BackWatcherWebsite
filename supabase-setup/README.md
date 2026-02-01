# Supabase Setup Folder

This folder contains all files needed to set up your Supabase backend.

## Files

- **`supabase_setup.sql`** - SQL script to create all database tables + security policies
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
- **download_leads** - Tracks emails from trial downloads

All tables have proper indexes for optimal query performance.

## Security

⚠️ **CRITICAL**: The SQL script includes Row Level Security (RLS) policies.

- RLS is **enabled** on all tables
- Only the `download_leads` table allows anonymous inserts
- All other tables require `service_role` (used by Edge Functions)
- **Never disable RLS** - it protects your customer data!

### What RLS Protects:
- User emails and personal data
- License keys (prevent theft)
- Payment information
