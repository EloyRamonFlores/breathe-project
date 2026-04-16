#!/usr/bin/env node

/**
 * Image Optimization Script for ToxinFree
 * Converts images to WebP format and compresses JPGs
 * Resizes based on category for web optimization
 * Supports: shared categories (educational, materials) + country-specific (countries/{slug}/)
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

// Shared categories with their target dimensions
const sharedCategories = {
  educational: { width: 1200, height: 675, fit: "cover" }, // 16:9
  materials: { width: 300, height: 300, fit: "cover" }, // 1:1 square
};

// Country-specific subdirectories and their dimensions
const countrySubdirs = {
  "resistance-stories": { width: 300, height: 300, fit: "cover" }, // 1:1 square
  hero: { width: 1920, height: 1080, fit: "cover" }, // 16:9
};

const imagesDir = path.join(import.meta.dirname, "../public/images");

async function optimizeDirectory(dirPath, dimensions, label) {
  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  if (imageFiles.length === 0) return 0;

  let processed = 0;
  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const basename = path.basename(file, path.extname(file));
    const webpPath = path.join(dirPath, `${basename}.webp`);
    const jpgPath = path.join(dirPath, `${basename}.jpg`);

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
        `      ✅ ${basename}.webp (${(webpStats.size / 1024).toFixed(1)}KB)`
      );

      // Create optimized JPG version (only if input isn't already JPG with same name)
      if (!inputPath.endsWith(".jpg") || basename !== file.split(".")[0]) {
        await sharp(inputPath)
          .resize(dimensions.width, dimensions.height, {
            fit: dimensions.fit,
            position: "center",
          })
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpgPath);

        const jpgStats = fs.statSync(jpgPath);
        console.log(
          `      ✅ ${basename}.jpg (${(jpgStats.size / 1024).toFixed(1)}KB)`
        );
      }
      processed++;
    } catch (error) {
      console.error(`      ❌ Error processing ${file}:`, error.message);
    }
  }
  return processed;
}

async function optimizeImages() {
  console.log("🖼️  ToxinFree Image Optimizer\n");
  console.log(`📁 Processing images from: ${imagesDir}\n`);

  // Process shared categories
  for (const [category, dimensions] of Object.entries(sharedCategories)) {
    const categoryDir = path.join(imagesDir, category);

    if (!fs.existsSync(categoryDir)) {
      console.log(`⏭️  Skipping ${category} (folder not found)\n`);
      continue;
    }

    console.log(`📂 Shared category: ${category}`);
    console.log(`   Target: ${dimensions.width}×${dimensions.height}px\n`);
    await optimizeDirectory(categoryDir, dimensions, category);
    console.log("");
  }

  // Process country-specific images
  const countriesDir = path.join(imagesDir, "countries");
  if (fs.existsSync(countriesDir)) {
    const countryFolders = fs.readdirSync(countriesDir).filter((f) =>
      fs.statSync(path.join(countriesDir, f)).isDirectory()
    );

    for (const country of countryFolders) {
      const countryDir = path.join(countriesDir, country);
      console.log(`🌍 Country: ${country}`);

      // Process country subdirectories (hero, resistance-stories, etc.)
      for (const [subdir, dimensions] of Object.entries(countrySubdirs)) {
        const subdirPath = path.join(countryDir, subdir);
        if (fs.existsSync(subdirPath)) {
          console.log(`   📁 ${subdir} (${dimensions.width}×${dimensions.height}px)`);
          const count = await optimizeDirectory(subdirPath, dimensions, `${country}/${subdir}`);
          if (count === 0) console.log(`      ⚠️  No images found`);
        }
      }

      // Process direct country files (e.g., hero.jpg in country root)
      const countryFiles = fs.readdirSync(countryDir).filter(
        (f) => /\.(jpg|jpeg|png|webp)$/i.test(f) && !fs.statSync(path.join(countryDir, f)).isDirectory()
      );
      if (countryFiles.length > 0) {
        console.log(`   📁 Root files`);
        await optimizeDirectory(countryDir, countrySubdirs.hero, `${country}/root`);
      }

      console.log("");
    }
  }

  console.log("✨ Optimization complete!");
  console.log("\n📝 New structure:");
  console.log("   public/images/");
  console.log("   ├── educational/      (shared)");
  console.log("   ├── materials/        (shared)");
  console.log("   └── countries/");
  console.log("       ├── colombia/");
  console.log("       │   └── resistance-stories/");
  console.log("       ├── argentina/");
  console.log("       └── ...\n");
}

optimizeImages().catch(console.error);
