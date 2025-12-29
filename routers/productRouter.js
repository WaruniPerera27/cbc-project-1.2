import express from 'express';
import { 
    createProduct, 
    deleteProduct, 
    getProducts, 
    updateProduct, 
    getProductById,
    searchProducts,
    getProductsBySubPage
} from '../controller/productController.js';

const productRouter = express.Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);

productRouter.get("/search/:query", searchProducts);
productRouter.get("/subpage/:subPage", getProductsBySubPage);

productRouter.get("/:productId", getProductById);
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct);

export default productRouter;
