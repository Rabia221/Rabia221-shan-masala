import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

// ── Schemas ───────────────────────────────────────────────────────────────────
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  image: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  ingredients: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product   = mongoose.models.Product  || mongoose.model("Product",  ProductSchema);

// ── Helper: "Shan Biryani Masala" → "Biryani Masala" ─────────────────────────
function toCategoryName(productName) {
  return productName.replace(/^Shan\s+/i, "").trim();
}

// ── Products list (category will be auto-derived from name) ───────────────────
const products = [
  // Biryani
  {
    name: "Shan Biryani Masala",
    description:
      "A premium blend of over 20 hand-picked spices that delivers the authentic taste of traditional Pakistani biryani. Each packet is carefully measured to give your rice the perfect color, aroma and depth of flavor. Simply marinate your meat, layer with rice and cook to perfection.",
    price: 120, stock: 150,
    image: "/uploads/default.jpg",
    ingredients: ["Coriander", "Cumin", "Black Pepper", "Cardamom", "Cinnamon", "Bay Leaves", "Star Anise", "Cloves"],
  },
  {
    name: "Shan Sindhi Biryani Masala",
    description:
      "Inspired by the rich culinary heritage of Sindh, this masala brings the bold and tangy flavors of Sindhi biryani to your kitchen. Made with dried plums, tomatoes and aromatic spices, it creates a biryani that is distinctly different and absolutely delicious.",
    price: 130, stock: 120,
    image: "/uploads/default.jpg",
    ingredients: ["Dried Plums", "Tomato Powder", "Red Chilli", "Turmeric", "Cumin", "Coriander"],
  },
  {
    name: "Shan Bombay Biryani Masala",
    description:
      "A classic recipe inspired by the iconic Bombay biryani, featuring a tangy and spicy profile with hints of dried plums and potatoes. Perfect for those who love a slightly sour kick in their biryani. Trusted by home cooks for generations.",
    price: 125, stock: 100,
    image: "/uploads/default.jpg",
    ingredients: ["Dried Plums", "Potato Starch", "Red Chilli", "Cumin", "Coriander", "Fennel"],
  },
  // Curry / Masala
  {
    name: "Shan Chicken Masala",
    description:
      "A perfectly balanced spice blend that transforms ordinary chicken into a restaurant-quality dish. The combination of warm spices, herbs and a hint of tanginess creates a rich, thick gravy that pairs beautifully with naan or rice. Ready in under 30 minutes.",
    price: 110, stock: 200,
    image: "/uploads/default.jpg",
    ingredients: ["Coriander", "Cumin", "Red Chilli", "Turmeric", "Garam Masala", "Dried Fenugreek"],
  },
  {
    name: "Shan Meat Masala",
    description:
      "Specially formulated for beef and mutton dishes, this masala delivers deep, robust flavors that penetrate the meat during slow cooking. The blend of whole and ground spices creates a thick, aromatic gravy perfect for special occasions and everyday meals alike.",
    price: 115, stock: 180,
    image: "/uploads/default.jpg",
    ingredients: ["Black Pepper", "Coriander", "Cumin", "Cardamom", "Cloves", "Cinnamon", "Red Chilli"],
  },
  {
    name: "Shan Korma Masala",
    description:
      "Brings the royal flavors of Mughal cuisine to your home. This rich blend of aromatic spices, nuts and dried fruits creates a creamy, mildly spiced korma that is perfect for celebrations and family gatherings. Pairs wonderfully with naan or steamed basmati rice.",
    price: 135, stock: 90,
    image: "/uploads/default.jpg",
    ingredients: ["Almonds", "Coconut", "Cardamom", "Rose Petals", "Saffron", "White Pepper", "Coriander"],
  },
  // BBQ & Tikka
  {
    name: "Shan Chicken Tikka Masala",
    description:
      "The ultimate marinade for juicy, smoky tikka. The vibrant red color and bold spice profile make it perfect for tandoor, oven or grill cooking. Just mix with yogurt, marinate overnight and cook for restaurant-style tikka at home.",
    price: 105, stock: 220,
    image: "/uploads/default.jpg",
    ingredients: ["Red Chilli", "Paprika", "Cumin", "Coriander", "Ginger", "Garlic", "Lemon Powder"],
  },
  {
    name: "Shan Seekh Kabab Masala",
    description:
      "Create perfectly spiced seekh kababs with this expertly crafted blend. Combines fresh herb flavors with warm spices to give your kababs the authentic street-food taste. Works great on the grill, in the oven or on a tawa.",
    price: 100, stock: 160,
    image: "/uploads/default.jpg",
    ingredients: ["Coriander Leaves", "Mint", "Green Chilli", "Cumin", "Black Pepper", "Garam Masala"],
  },
  {
    name: "Shan BBQ Masala",
    description:
      "A smoky, bold spice blend designed for outdoor grilling and barbecue. Whether you are grilling chicken, beef or vegetables, this masala adds a deep charcoal-kissed flavor that will impress every guest at your barbecue party.",
    price: 115, stock: 140,
    image: "/uploads/default.jpg",
    ingredients: ["Smoked Paprika", "Black Pepper", "Garlic Powder", "Onion Powder", "Cumin", "Oregano"],
  },
  // Karahi & Handi
  {
    name: "Shan Karahi Gosht Masala",
    description:
      "Captures the bold, rustic flavors of a traditional wok-cooked karahi. The blend of whole spices, tomatoes and green chillies creates a thick, intensely flavored gravy that clings to every piece of meat. Best served sizzling hot straight from the karahi.",
    price: 120, stock: 175,
    image: "/uploads/default.jpg",
    ingredients: ["Tomato Powder", "Green Chilli", "Ginger", "Coriander", "Cumin", "Black Pepper", "Kashmiri Chilli"],
  },
  {
    name: "Shan Handi Masala",
    description:
      "Inspired by the slow-cooked handi dishes of old Lahore, this masala blend creates a rich, creamy and deeply aromatic curry. The slow-release spices develop complex flavors during cooking, resulting in a dish that tastes like it has been simmering for hours.",
    price: 125, stock: 110,
    image: "/uploads/default.jpg",
    ingredients: ["Cream Powder", "Cardamom", "Cinnamon", "Cloves", "Coriander", "Cumin", "Dried Fenugreek"],
  },
  // Pulao & Rice
  {
    name: "Shan Yakhni Pulao Masala",
    description:
      "A delicate blend of whole spices that creates a fragrant, light-colored pulao with a rich meat broth base. The subtle flavors of cardamom, cinnamon and bay leaves infuse every grain of rice, making it the perfect dish for weddings and celebrations.",
    price: 110, stock: 130,
    image: "/uploads/default.jpg",
    ingredients: ["Cardamom", "Cinnamon", "Bay Leaves", "Black Pepper", "Cloves", "Star Anise", "Cumin"],
  },
  {
    name: "Shan Kabuli Pulao Masala",
    description:
      "Recreate the famous Afghan Kabuli Pulao at home with this authentic spice blend. Combines warm spices with a hint of sweetness from raisins and carrots to create a dish that is both savory and subtly sweet — a true crowd-pleaser.",
    price: 115, stock: 95,
    image: "/uploads/default.jpg",
    ingredients: ["Cardamom", "Cumin", "Raisin Powder", "Carrot Powder", "Cinnamon", "Black Pepper"],
  },
  // Snacks & Chaat
  {
    name: "Shan Chaat Masala",
    description:
      "The ultimate finishing spice for all your favorite street foods. Sprinkle it on fruit chaat, dahi puri, samosas or even popcorn for an instant burst of tangy, spicy and savory flavor. A must-have in every Pakistani kitchen.",
    price: 85, stock: 300,
    image: "/uploads/default.jpg",
    ingredients: ["Dried Mango Powder", "Black Salt", "Cumin", "Coriander", "Red Chilli", "Mint Powder"],
  },
  {
    name: "Shan Dahi Baray Masala",
    description:
      "Make perfectly spiced dahi baray with this specially crafted masala. Contains the ideal blend of tangy tamarind, cooling mint and warming spices that complement the creamy yogurt topping. A beloved Pakistani snack made easy.",
    price: 90, stock: 200,
    image: "/uploads/default.jpg",
    ingredients: ["Tamarind Powder", "Mint", "Cumin", "Red Chilli", "Black Salt", "Coriander"],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB Atlas\n");

  for (const prod of products) {
    const catName = toCategoryName(prod.name); // e.g. "Korma Masala"

    // 1. Upsert category with same name as product (minus "Shan ")
    const catDoc = await Category.findOneAndUpdate(
      { name: catName },
      { $setOnInsert: { name: catName, description: `${catName} spice blend by Shan`, isActive: true } },
      { upsert: true, returnDocument: "after" }
    );

    // 2. Upsert product with that category's _id
    const prodDoc = await Product.findOneAndUpdate(
      { name: prod.name },
      { $set: { ...prod, category: catDoc._id } },
      { upsert: true, returnDocument: "after" }
    );

    // 3. Add product _id into category.products (no duplicates)
    await Category.findByIdAndUpdate(catDoc._id, {
      $addToSet: { products: prodDoc._id },
    });

    console.log(`✅ "${prod.name}"  →  Category: "${catName}"`);
  }

  console.log(`\n🎉 Done! ${products.length} products seeded, each with its own matching category.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
