#!/usr/bin/env node

/**
 * Copy shared package to backend node_modules for deployment
 * This fixes workspace issues in production environments
 */

const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'shared', 'dist');
const target = path.join(__dirname, 'backend', 'node_modules', '@discern', 'shared');

console.log('Copying shared package...');
console.log('From:', source);
console.log('To:', target);

// Create target directory
fs.mkdirSync(target, { recursive: true });

// Copy dist files
copyDir(source, target);

// Copy package.json
fs.copyFileSync(
  path.join(__dirname, 'shared', 'package.json'),
  path.join(target, 'package.json')
);

console.log('✓ Shared package copied successfully!');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
