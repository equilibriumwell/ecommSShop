import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  productName: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [1, "Price of product should be above 1."],
  },
  description: { type: String, required: true },
  imageURL: { type: String, required: true },
  stockQuantity: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be lower than 0."],
  },
});

export const ProductModel = model("product", ProductSchema);
