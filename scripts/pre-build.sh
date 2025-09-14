#!/bin/bash

# Pre-build script to handle Rollup optional dependency issues
echo "🔧 Pre-build: Checking build environment..."

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 21 ]; then
    echo "❌ Node version $NODE_VERSION detected. Please use Node 20 LTS for builds."
    echo "💡 Run: nvm use 20 (if using nvm)"
    exit 1
fi

echo "✅ Node version check passed"

# Check if we need to handle optional dependencies
if [ ! -f "node_modules/.build-deps-ok" ]; then
    echo "🔧 Ensuring optional dependencies are properly installed..."
    
    # Clean and reinstall if rollup native deps are missing
    if ! node -e "require('rollup')" 2>/dev/null; then
        echo "🚨 Rollup native dependencies missing, cleaning and reinstalling..."
        rm -rf node_modules package-lock.json
        npm cache clean --force 2>/dev/null || true
        npm install
    fi
    
    # Mark as ready
    touch node_modules/.build-deps-ok
    echo "✅ Build dependencies verified"
fi

echo "🎉 Pre-build checks completed successfully"