import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected to MongoDB Atlas\n");

const db = mongoose.connection.db;
const productsCol  = db.collection("products");
const categoriesCol = db.collection("categories");

// Helper: "Shan Biryani Masala" → "Biryani Masala", "Premium Chaat Masala" → "Chaat Masala"
function toCategoryName(productName) {
  return productName
    .replace(/^Shan\s+/i, "")
    .replace(/^Premium\s+/i, "")
    .replace(/^Authentic\s+/i, "")
    .replace(/^Organic\s+/i, "")
    .replace(/^Whole\s+/i, "")
    .replace(/^Fine\s+/i, "")
    .replace(/^Instant\s+/i, "")
    .replace(/^Hot\s+/i, "")
    .replace(/^Dried\s+/i, "")
    .trim();
}

const allProducts = await productsCol.find({}).toArray();
console.log(`Found ${allProducts.length} products to process...\n`);

for (const prod of allProducts) {
  const catName = toCategoryName(prod.name);

  // 1. Upsert category by name
  await categoriesCol.updateOne(
    { name: catName },
    {
      $setOnInsert: {
        name: catName,
        description: `${catName} spice blend by Shan`,
        isActive: true,
        products: [],
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  const catDoc = await categoriesCol.findOne({ name: catName });

  // 2. Update product's category field to ObjectId
  await productsCol.updateOne(
    { _id: prod._id },
    { $set: { category: catDoc._id } }
  );

  // 3. Add product _id to category.products (no duplicates)
  await categoriesCol.updateOne(
    { _id: catDoc._id },
    { $addToSet: { products: prod._id } }
  );

  console.log(`✅  "${prod.name}"  →  Category: "${catName}"`);
}

console.log(`\n🎉 All ${allProducts.length} products fixed with matching categories!`);
await mongoose.disconnect();
