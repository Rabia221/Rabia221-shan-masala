import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
