#!/usr/bin/env node

/**
 * Build fix for Rollup optional dependency issue
 * This script handles the missing @rollup/rollup-linux-x64-gnu dependency
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Checking for Rollup build dependencies...');

try {
  // Check if we're in a build environment that needs the fix
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  const rollupPath = path.join(nodeModulesPath, 'rollup');
  
  if (fs.existsSync(rollupPath)) {
    console.log('✅ Rollup found, checking native dependencies...');
    
    // Try to require rollup to see if native deps are working
    try {
      require('rollup');
      console.log('✅ Rollup native dependencies working correctly');
    } catch (error) {
      if (error.message.includes('@rollup/rollup-linux-x64-gnu')) {
        console.log('🚨 Detected missing Rollup native dependency, attempting fix...');
        
        try {
          // Force reinstall of rollup with platform-specific dependencies
          execSync('npm install --force --no-optional=false rollup', { 
            stdio: 'inherit',
            cwd: process.cwd()
          });
          console.log('✅ Rollup dependencies fixed');
        } catch (installError) {
          console.warn('⚠️  Could not auto-fix Rollup dependencies:', installError.message);
          console.log('💡 Manual fix: rm -rf node_modules package-lock.json && npm install');
        }
      } else {
        throw error;
      }
    }
  }
} catch (error) {
  console.error('❌ Build fix failed:', error.message);
  process.exit(1);
}

console.log('🎉 Build environment ready');