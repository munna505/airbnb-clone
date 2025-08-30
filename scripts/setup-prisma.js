#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Setting up Prisma for deployment...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('✅ Prisma client generated successfully!');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}
