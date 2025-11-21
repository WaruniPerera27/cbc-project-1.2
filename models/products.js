import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    altName: { type: [String], default: [] },
    labledPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: [String], default: [] },
    description: { type: String, required: true }, 
    stock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    category: { type: String, required: true, default: "cosmetics" } ,
    subPage: { 
        type: String, 
        enum: ["Skin Care", "Hair Care", "Wellness", "Beauty", "Fragrance"], 
        required: true 
    } 
});

const Product = mongoose.model("products", productSchema);
export default Product;