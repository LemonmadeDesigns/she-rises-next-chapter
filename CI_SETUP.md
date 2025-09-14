# CI Setup for Rollup Build Fix

This document provides the recommended CI configuration to resolve the Rollup optional dependency build error.

## GitLab CI Example

Add this to your `.gitlab-ci.yml`:

```yaml
image: node:20-bullseye

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm/_cacache"
  NPM_CONFIG_OPTIONAL: "true"

cache:
  paths:
    - .npm/_cacache/

before_script:
  - rm -rf node_modules package-lock.json
  - npm cache clean --force
  - npm ci

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

test:
  stage: test
  script:
    - npm run lint
    - npm run typecheck
```

## GitHub Actions Example

Add this to `.github/workflows/build.yml`:

```yaml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js 20
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Clean install dependencies
      run: |
        rm -rf node_modules package-lock.json
        npm cache clean --force
        npm ci
    
    - name: Run build
      run: npm run build
    
    - name: Run tests
      run: |
        npm run lint
        npm run typecheck
```

## Local Development

1. Use Node 20 LTS:
   ```bash
   nvm use 20  # if using nvm
   ```

2. Clean install if you encounter the Rollup error:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

3. The build should now work:
   ```bash
   npm run build
   ```

## Files Created

- `.nvmrc` - Specifies Node 20 for local development
- `.npmrc` - Configures npm for optional dependencies
- `scripts/build-fix.js` - Auto-fix script for Rollup issues
- `scripts/pre-build.sh` - Pre-build validation script

## Key Points

1. **Use Node 20**: The issue is most common with Node 21+
2. **Clean installs**: Remove node_modules and package-lock.json when switching environments
3. **Optional dependencies**: Ensure npm handles them correctly with the .npmrc settings
4. **Force cache clear**: Always clear npm cache when troubleshooting

## Troubleshooting

If you still see the error:

1. Verify Node version: `node --version` (should be 20.x)
2. Clear everything: `rm -rf node_modules package-lock.json .npm`
3. Clear cache: `npm cache clean --force`
4. Fresh install: `npm install`
5. Try build: `npm run build`