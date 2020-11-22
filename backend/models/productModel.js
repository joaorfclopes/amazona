import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    image: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number },
    sizable: { type: Boolean },
    countInStock: { type: Number },
    taxPrice: { type: Number },
    finalPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
