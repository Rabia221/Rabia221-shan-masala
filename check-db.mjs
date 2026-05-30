import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });

await mongoose.connect(process.env.MONGODB_URI);

const products = await mongoose.connection.db.collection("products").find({}).toArray();
const categories = await mongoose.connection.db.collection("categories").find({}).toArray();

console.log("\n=== ALL PRODUCTS ===");
products.forEach(p => {
  console.log(`${p.name} | category: ${p.category || "MISSING"}`);
});

console.log("\n=== ALL CATEGORIES ===");
categories.forEach(c => {
  console.log(`${c.name} | products: ${c.products?.length || 0}`);
});

await mongoose.disconnect();
