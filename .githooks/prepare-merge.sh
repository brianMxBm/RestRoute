#!/bin/bash

echo "🔄 Running post-merge preparations..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found"
    
    # Check if .env.vault exists
    if [ -f .env.vault ]; then
        echo "📥 Found .env.vault, attempting to pull environment variables..."
        bunx dotenv-vault pull
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pulled environment variables"
        else
            echo "❌ Failed to pull environment variables. Please check your DOTENV_KEY"
        fi
    else
        echo "❌ No .env.vault found. Please get the vault file from your team"
    fi
fi

# Install dependencies if package.json was changed
if git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep --quiet "package.json"; then
    echo "📦 Package.json changed, installing dependencies..."
    bun install
fi

# Build packages if needed
echo "🏗️  Building packages..."
bun run build

echo "✅ Post-merge preparations complete"