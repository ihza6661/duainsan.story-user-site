#!/usr/bin/env node

/**
 * WebP Conversion Script
 * 
 * Converts all JPEG/PNG images to WebP format while maintaining originals.
 * WebP provides 25-35% better compression than JPEG/PNG with similar quality.
 * 
 * Usage: node scripts/convert-to-webp.js [--dry-run] [--quality=80]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DRY_RUN = process.argv.includes('--dry-run');
const QUALITY_ARG = process.argv.find(arg => arg.startsWith('--quality='));
const WEBP_QUALITY = QUALITY_ARG ? parseInt(QUALITY_ARG.split('=')[1]) : 80;

// Directories to scan for images
const IMAGE_DIRS = [
  'products',
  'hero',
  'highlight',
  'lookbook',
  'category',
  'brand_logo',
  'logo',
  'pemesanan-undangan-cetak'
];

// Statistics
const stats = {
  totalFiles: 0,
  totalOriginalSize: 0,
  totalWebPSize: 0,
  converted: 0,
  skipped: 0,
  errors: 0
};

/**
 * Format bytes to human readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if file should be converted
 */
function shouldConvert(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png'].includes(ext);
}

/**
 * Convert image to WebP
 */
async function convertToWebP(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const dir = path.dirname(filePath);
    const basename = path.basename(filePath, ext);
    const webpPath = path.join(dir, `${basename}.webp`);
    
    // Skip if WebP already exists
    if (fs.existsSync(webpPath) && !DRY_RUN) {
      console.log(`   ⏭️  WebP version already exists`);
      stats.skipped++;
      return;
    }
    
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    console.log(`\n📸 Converting: ${path.relative(PUBLIC_DIR, filePath)}`);
    console.log(`   Original size: ${formatBytes(originalSize)} (${ext})`);
    
    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would convert to ${basename}.webp`);
      stats.totalOriginalSize += originalSize;
      stats.converted++;
      return;
    }
    
    // Convert to WebP
    await sharp(filePath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    
    // Get new file size
    const webpStats = fs.statSync(webpPath);
    const webpSize = webpStats.size;
    const savings = originalSize - webpSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    console.log(`   ✓ Created: ${basename}.webp (${formatBytes(webpSize)})`);
    console.log(`   💾 Saved: ${formatBytes(savings)} (${savingsPercent}%)`);
    
    stats.totalOriginalSize += originalSize;
    stats.totalWebPSize += webpSize;
    stats.converted++;
    
  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Scan directory recursively and convert images
 */
async function convertDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Skip .originals directories
    if (entry.name === '.originals') {
      continue;
    }
    
    if (entry.isDirectory()) {
      await convertDirectory(fullPath);
    } else if (entry.isFile() && shouldConvert(entry.name)) {
      stats.totalFiles++;
      await convertToWebP(fullPath);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 WebP Conversion Script');
  console.log('==========================\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No files will be created\n');
  }
  
  console.log(`📁 Scanning directories: ${IMAGE_DIRS.join(', ')}`);
  console.log(`🎨 WebP quality: ${WEBP_QUALITY}%`);
  console.log(`📝 Note: Original JPEGs/PNGs will be kept for fallback\n`);
  
  const startTime = Date.now();
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`\n⚠️  Directory not found: ${dir}`);
      continue;
    }
    
    console.log(`\n📂 Processing directory: ${dir}`);
    await convertDirectory(dirPath);
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalSavings = stats.totalOriginalSize - stats.totalWebPSize;
  const totalSavingsPercent = stats.totalOriginalSize > 0 
    ? ((totalSavings / stats.totalOriginalSize) * 100).toFixed(1)
    : 0;
  
  console.log('\n\n📊 Conversion Summary');
  console.log('=====================');
  console.log(`Total convertible files found: ${stats.totalFiles}`);
  console.log(`Successfully converted: ${stats.converted}`);
  console.log(`Skipped (already exists): ${stats.skipped}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal size (JPEG/PNG): ${formatBytes(stats.totalOriginalSize)}`);
  
  if (!DRY_RUN) {
    console.log(`WebP size: ${formatBytes(stats.totalWebPSize)}`);
    console.log(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  }
  
  console.log(`\nCompleted in ${duration}s`);
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to actually convert images');
  } else {
    console.log('\n✅ WebP images created! Original JPEGs/PNGs preserved for fallback.');
    console.log('💡 Update your frontend to use <picture> tags with WebP + fallback.');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
