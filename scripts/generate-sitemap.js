/**
 * Sitemap Generator Script
 * 
 * This script generates a sitemap.xml file for the Dua Insan Story website.
 * It includes both static and dynamic routes (products, categories, templates).
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * Output:
 *   public/sitemap.xml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = process.env.VITE_BASE_URL || 'https://duainsanstory.eproject.tech';
const API_URL = process.env.VITE_API_BASE_URL || 'https://dua-insan-story-app-5548c3de441b.herokuapp.com/api/v1';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

/**
 * Static routes configuration
 * Each route has: path, priority, changefreq
 */
const STATIC_ROUTES = [
  // Home page - highest priority
  { path: '/', priority: 1.0, changefreq: 'daily' },
  
  // Main shopping pages
  { path: '/products', priority: 0.9, changefreq: 'daily' },
  { path: '/digital-templates', priority: 0.9, changefreq: 'daily' },
  { path: '/cart', priority: 0.6, changefreq: 'weekly' },
  
  // Info pages
  { path: '/gallery', priority: 0.7, changefreq: 'weekly' },
  { path: '/CaraPesan', priority: 0.7, changefreq: 'monthly' },
  { path: '/info-pemesanan-cetak', priority: 0.7, changefreq: 'monthly' },
  
  // Legal pages
  { path: '/syarat-ketentuan', priority: 0.4, changefreq: 'monthly' },
  { path: '/kebijakan-privasi', priority: 0.4, changefreq: 'monthly' },
  { path: '/pengembalian-refund', priority: 0.4, changefreq: 'monthly' },
];

/**
 * Fetch data from API with error handling
 */
async function fetchAPI(endpoint) {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    return null;
  }
}

/**
 * Fetch all products with pagination
 */
async function fetchAllProducts() {
  const products = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetchAPI(`/customer/products?page=${page}&per_page=100`);
    
    if (!response || !response.data || response.data.length === 0) {
      hasMore = false;
      break;
    }
    
    products.push(...response.data);
    
    // Check if there are more pages
    if (response.meta && response.meta.current_page < response.meta.last_page) {
      page++;
    } else {
      hasMore = false;
    }
  }
  
  console.log(`✓ Fetched ${products.length} products`);
  return products;
}

/**
 * Fetch all product categories
 */
async function fetchCategories() {
  const response = await fetchAPI('/customer/product-categories');
  
  if (!response || !response.data) {
    console.log('✗ No categories found');
    return [];
  }
  
  console.log(`✓ Fetched ${response.data.length} categories`);
  return response.data;
}

/**
 * Fetch all digital invitation templates
 */
async function fetchDigitalTemplates() {
  const response = await fetchAPI('/customer/invitation-templates');
  
  if (!response || !response.data) {
    console.log('✗ No digital templates found');
    return [];
  }
  
  console.log(`✓ Fetched ${response.data.length} digital templates`);
  return response.data;
}

/**
 * Format date to W3C Datetime format (ISO 8601)
 * Example: 2025-12-14T00:00:00+00:00
 */
function formatDate(date) {
  return new Date(date).toISOString();
}

/**
 * Generate sitemap XML
 */
function generateSitemapXML(urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

/**
 * Main function
 */
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...\n');
  
  const urls = [];
  const today = formatDate(new Date());
  
  // 1. Add static routes
  console.log('📄 Adding static routes...');
  STATIC_ROUTES.forEach(route => {
    urls.push({
      loc: `${BASE_URL}${route.path}`,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });
  console.log(`✓ Added ${STATIC_ROUTES.length} static routes\n`);
  
  // 2. Fetch and add dynamic routes
  console.log('🔄 Fetching dynamic routes...\n');
  
  // 2a. Add product categories
  const categories = await fetchCategories();
  categories.forEach(category => {
    urls.push({
      loc: `${BASE_URL}/products/category/${category.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });
  console.log();
  
  // 2b. Add products
  const products = await fetchAllProducts();
  products.forEach(product => {
    urls.push({
      loc: `${BASE_URL}/product/${product.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });
  console.log();
  
  // 2c. Add digital templates
  const templates = await fetchDigitalTemplates();
  templates.forEach(template => {
    urls.push({
      loc: `${BASE_URL}/digital-templates/${template.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.7,
    });
  });
  console.log();
  
  // 3. Generate XML
  console.log('📝 Generating sitemap XML...');
  const xml = generateSitemapXML(urls);
  
  // 4. Write to file
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  
  // 5. Success summary
  console.log('\n✅ Sitemap generated successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   • Total URLs: ${urls.length}`);
  console.log(`   • Static routes: ${STATIC_ROUTES.length}`);
  console.log(`   • Categories: ${categories.length}`);
  console.log(`   • Products: ${products.length}`);
  console.log(`   • Digital templates: ${templates.length}`);
  console.log(`   • Output: ${OUTPUT_PATH}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`🔗 Sitemap URL: ${BASE_URL}/sitemap.xml`);
  console.log('\n📋 Next steps:');
  console.log('   1. Test sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html');
  console.log('   2. Submit to Google: https://search.google.com/search-console');
  console.log('   3. Submit to Bing: https://www.bing.com/webmasters');
}

// Run the script
generateSitemap().catch(error => {
  console.error('\n❌ Error generating sitemap:', error);
  process.exit(1);
});
