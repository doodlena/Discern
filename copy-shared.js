#!/usr/bin/env node

/**
 * Copy shared package and Prisma client to backend node_modules for deployment
 * This fixes workspace issues in production environments
 */

const fs = require('fs');
const path = require('path');

// Copy shared package
const sharedSource = path.join(__dirname, 'shared', 'dist');
const sharedTarget = path.join(__dirname, 'backend', 'node_modules', '@discern', 'shared');

console.log('Copying shared package...');
console.log('From:', sharedSource);
console.log('To:', sharedTarget);

fs.mkdirSync(sharedTarget, { recursive: true });
copyDir(sharedSource, sharedTarget);
fs.copyFileSync(
  path.join(__dirname, 'shared', 'package.json'),
  path.join(sharedTarget, 'package.json')
);

console.log('✓ Shared package copied successfully!');

// Copy Prisma client
const prismaSource = path.join(__dirname, 'node_modules', '.prisma');
const prismaTarget = path.join(__dirname, 'backend', 'node_modules', '.prisma');
const prismaClientSource = path.join(__dirname, 'node_modules', '@prisma', 'client');
const prismaClientTarget = path.join(__dirname, 'backend', 'node_modules', '@prisma', 'client');

if (fs.existsSync(prismaSource)) {
  console.log('Copying Prisma client...');
  console.log('From:', prismaSource);
  console.log('To:', prismaTarget);

  copyDir(prismaSource, prismaTarget);

  if (fs.existsSync(prismaClientSource)) {
    copyDir(prismaClientSource, prismaClientTarget);
  }

  console.log('✓ Prisma client copied successfully!');
} else {
  console.log('⚠ Prisma client not found, skipping...');
}

console.log('✓ All done!');

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
