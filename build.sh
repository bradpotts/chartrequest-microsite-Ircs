#!/bin/bash

# Cloudflare Pages build script
# This script helps handle the esbuild/wrangler installation issues

echo "Starting Cloudflare Pages build..."

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Install dependencies with retry logic
echo "Installing dependencies..."
npm ci --no-audit --no-fund --maxsockets=1 || {
    echo "First install attempt failed, retrying..."
    rm -rf node_modules package-lock.json
    npm install --no-audit --no-fund --maxsockets=1
}

# Build the project
echo "Building project..."
npm run build

echo "Build completed successfully!"
