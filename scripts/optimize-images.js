#!/usr/bin/env node

/**
 * Image Optimization Script for ToxinFree
 * Converts images to WebP format and compresses JPGs
 * Resizes based on category for web optimization
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Image categories with their target dimensions
const categories = {
  educational: { width: 1200, height: 675, fit: "cover" }, // 16:9
  countries: { width: 1920, height: 1080, fit: "cover" }, // 16:9
  materials: { width: 300, height: 300, fit: "cover" }, // 1:1 square
  "resistance-stories": { width: 300, height: 300, fit: "cover" }, // 1:1 square
};

const imagesDir = path.join(__dirname, "../public/images");

async function optimizeImages() {
  console.log("🖼️  ToxinFree Image Optimizer\n");
  console.log(`📁 Processing images from: ${imagesDir}\n`);

  for (const [category, dimensions] of Object.entries(categories)) {
    const categoryDir = path.join(imagesDir, category);

    // Skip if category doesn't exist
    if (!fs.existsSync(categoryDir)) {
      console.log(`⏭️  Skipping ${category} (folder not found)\n`);
      continue;
    }

    console.log(`📂 Processing: ${category}`);
    console.log(`   Target: ${dimensions.width}×${dimensions.height}px (${dimensions.fit})\n`);

    const files = fs.readdirSync(categoryDir);
    const imageFiles = files.filter((f) =>
      /\.(jpg|jpeg|png|webp)$/i.test(f)
    );

    if (imageFiles.length === 0) {
      console.log(`   ⚠️  No images found\n`);
      continue;
    }

    for (const file of imageFiles) {
      const inputPath = path.join(categoryDir, file);
      const basename = path.basename(file, path.extname(file));
      const webpPath = path.join(categoryDir, `${basename}.webp`);
      const jpgPath = path.join(categoryDir, `${basename}.jpg`);

      try {
        // Create WebP version
        await sharp(inputPath)
          .resize(dimensions.width, dimensions.height, {
            fit: dimensions.fit,
            position: "center",
          })
          .webp({ quality: 80 })
          .toFile(webpPath);

        const webpStats = fs.statSync(webpPath);
        console.log(
          `   ✅ ${basename}.webp (${(webpStats.size / 1024).toFixed(1)}KB)`
        );

        // Create optimized JPG version
        await sharp(inputPath)
          .resize(dimensions.width, dimensions.height, {
            fit: dimensions.fit,
            position: "center",
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpgPath);

        const jpgStats = fs.statSync(jpgPath);
        console.log(
          `   ✅ ${basename}.jpg (${(jpgStats.size / 1024).toFixed(1)}KB)`
        );
      } catch (error) {
        console.error(`   ❌ Error processing ${file}:`, error.message);
      }
    }

    console.log("");
  }

  console.log("✨ Optimization complete!");
  console.log("\n📝 Next steps:");
  console.log("   1. Update EducationalImage component to use .webp with .jpg fallback");
  console.log("   2. Update country hero images to use .webp");
  console.log("   3. Update material images to use .webp\n");
}

optimizeImages().catch(console.error);
