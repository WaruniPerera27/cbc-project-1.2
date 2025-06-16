import express from 'express';
import { createProduct, getProducts } from '../controller/productController.js'; // Added getProducts import

const productRouter = express.Router();
productRouter.post("/", createProduct);
productRouter.get("/", getProducts);

export default productRouter;