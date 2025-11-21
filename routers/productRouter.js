import express from 'express';
import { createProduct, deleteProduct, getProducts, updateProduct,getProductById ,searchProducts,getProductsBySubPage} from '../controller/productController.js'; // Added getProducts import

const productRouter = express.Router();
productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductById) 
productRouter.delete("/:productId", deleteProduct);
productRouter.put("/:productId", updateProduct)
productRouter.get("/search/:query", searchProducts)
productRouter.get("/subpage/:subPage", getProductsBySubPage);



export default productRouter;