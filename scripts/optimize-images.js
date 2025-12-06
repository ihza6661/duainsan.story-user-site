#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * Compresses all images in the public directory using sharp and imagemin.
 * Creates backups in .originals folders before optimization.
 * 
 * Usage: node scripts/optimize-images.js [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminWebp from 'imagemin-webp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DRY_RUN = process.argv.includes('--dry-run');

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

// Image optimization settings
const JPEG_QUALITY = 80;
const PNG_QUALITY = [0.65, 0.80];
const WEBP_QUALITY = 80;
const MAX_WIDTH = 2000; // Max width for images

// Statistics
const stats = {
  totalFiles: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  processed: 0,
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
 * Check if file is an image
 */
function isImage(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
}

/**
 * Create backup of original image
 */
function createBackup(filePath) {
  const dir = path.dirname(filePath);
  const backupDir = path.join(dir, '.originals');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const filename = path.basename(filePath);
  const backupPath = path.join(backupDir, filename);
  
  // Only backup if backup doesn't exist
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    return true;
  }
  
  return false;
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const originalStats = fs.statSync(filePath);
    const originalSize = originalStats.size;
    
    console.log(`\n📸 Processing: ${path.relative(PUBLIC_DIR, filePath)}`);
    console.log(`   Original size: ${formatBytes(originalSize)}`);
    
    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would optimize this file`);
      stats.totalOriginalSize += originalSize;
      stats.processed++;
      return;
    }
    
    // Create backup
    const backedUp = createBackup(filePath);
    if (backedUp) {
      console.log(`   ✓ Backup created`);
    }
    
    // Optimize based on file type
    if (ext === '.png') {
      // PNG optimization
      await imagemin([filePath], {
        destination: path.dirname(filePath),
        glob: false,
        plugins: [
          imageminPngquant({
            quality: PNG_QUALITY,
            speed: 1
          })
        ]
      });
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      // JPEG optimization with sharp (resize if needed) + mozjpeg
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // Resize if image is too wide
      if (metadata.width > MAX_WIDTH) {
        await image
          .resize(MAX_WIDTH, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: JPEG_QUALITY, progressive: true })
          .toFile(filePath + '.tmp');
        
        fs.renameSync(filePath + '.tmp', filePath);
        console.log(`   ✓ Resized from ${metadata.width}px to ${MAX_WIDTH}px`);
      }
      
      // Apply mozjpeg compression
      await imagemin([filePath], {
        destination: path.dirname(filePath),
        glob: false,
        plugins: [
          imageminMozjpeg({
            quality: JPEG_QUALITY,
            progressive: true
          })
        ]
      });
    } else if (ext === '.webp') {
      // WebP optimization
      await imagemin([filePath], {
        destination: path.dirname(filePath),
        glob: false,
        plugins: [
          imageminWebp({
            quality: WEBP_QUALITY
          })
        ]
      });
    }
    
    // Get new file size
    const optimizedStats = fs.statSync(filePath);
    const optimizedSize = optimizedStats.size;
    const savings = originalSize - optimizedSize;
    const savingsPercent = ((savings / originalSize) * 100).toFixed(1);
    
    console.log(`   ✓ Optimized: ${formatBytes(optimizedSize)} (saved ${formatBytes(savings)} / ${savingsPercent}%)`);
    
    stats.totalOriginalSize += originalSize;
    stats.totalOptimizedSize += optimizedSize;
    stats.processed++;
    
  } catch (error) {
    console.error(`   ✗ Error: ${error.message}`);
    stats.errors++;
  }
}

/**
 * Scan directory recursively and optimize images
 */
async function optimizeDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Skip .originals directories
    if (entry.name === '.originals') {
      continue;
    }
    
    if (entry.isDirectory()) {
      await optimizeDirectory(fullPath);
    } else if (entry.isFile() && isImage(entry.name)) {
      stats.totalFiles++;
      await optimizeImage(fullPath);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('============================\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No files will be modified\n');
  }
  
  console.log(`📁 Scanning directories: ${IMAGE_DIRS.join(', ')}`);
  console.log(`📊 Quality settings:`);
  console.log(`   - JPEG: ${JPEG_QUALITY}%`);
  console.log(`   - PNG: ${PNG_QUALITY[0] * 100}-${PNG_QUALITY[1] * 100}%`);
  console.log(`   - WebP: ${WEBP_QUALITY}%`);
  console.log(`   - Max width: ${MAX_WIDTH}px`);
  
  const startTime = Date.now();
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    const dirPath = path.join(PUBLIC_DIR, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`\n⚠️  Directory not found: ${dir}`);
      continue;
    }
    
    console.log(`\n📂 Processing directory: ${dir}`);
    await optimizeDirectory(dirPath);
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalSavings = stats.totalOriginalSize - stats.totalOptimizedSize;
  const totalSavingsPercent = stats.totalOriginalSize > 0 
    ? ((totalSavings / stats.totalOriginalSize) * 100).toFixed(1)
    : 0;
  
  console.log('\n\n📊 Optimization Summary');
  console.log('======================');
  console.log(`Total files found: ${stats.totalFiles}`);
  console.log(`Successfully processed: ${stats.processed}`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`\nOriginal size: ${formatBytes(stats.totalOriginalSize)}`);
  
  if (!DRY_RUN) {
    console.log(`Optimized size: ${formatBytes(stats.totalOptimizedSize)}`);
    console.log(`Total savings: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`);
  }
  
  console.log(`\nCompleted in ${duration}s`);
  
  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to actually optimize images');
  } else {
    console.log('\n✅ All images optimized! Backups saved in .originals folders');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
