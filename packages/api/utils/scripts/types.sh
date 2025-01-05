#!/bin/bash

echo "🔄 Checking Supabase setup..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found"
    echo "Installing Supabase CLI..."
    if command -v brew &> /dev/null; then
        brew install supabase/tap/supabase
    else
        bun add -g supabase
    fi
fi

# Check if logged into Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged into Supabase"
    if [ -z "${SUPABASE_ACCESS_TOKEN}" ]; then
        echo "Please run 'supabase login' or set SUPABASE_ACCESS_TOKEN in your .env"
        supabase login
    fi
fi

# Find the root directory and Supabase directory
ROOT_DIR=$(git rev-parse --show-toplevel)
SUPABASE_DIR="${ROOT_DIR}/packages/api/supabase"

# Source .env file if it exists
if [ -f "${ROOT_DIR}/.env" ]; then
    source "${ROOT_DIR}/.env"
    echo "📖 Loaded environment from ${ROOT_DIR}/.env"
fi

# Check if SUPABASE_PROJECT_ID and SUPABASE_DB_PASSWORD exist in environment
if [ -z "${SUPABASE_PROJECT_ID}" ] || [ -z "${SUPABASE_DB_PASSWORD}" ]; then
    echo "❌ Missing Supabase credentials in .env file"
    echo "Required variables: SUPABASE_PROJECT_ID, SUPABASE_DB_PASSWORD"
    exit 1
fi

# Link Supabase from the correct directory
cd "${SUPABASE_DIR}"
supabase link --project-ref "${SUPABASE_PROJECT_ID}" -p "${SUPABASE_DB_PASSWORD}"

# Generate types
supabase gen types typescript --linked > types/database.types.ts

echo "✅ Types generated successfully"