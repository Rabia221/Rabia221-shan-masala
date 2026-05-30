import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
