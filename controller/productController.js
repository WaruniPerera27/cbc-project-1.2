import Product from '../models/products.js';
import { isAdmin } from './userController.js';

export async function createProduct(req, res) {

    if (!isAdmin(req)){
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
    
	const product = new Product(req.body)  

    try{
        const response = await product.save();

        res.json({
         message: "Product created successfully", 
         product: response 
        });


    }catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

	
}

export async function getProducts(req, res) {

    try{
        if(isAdmin(req)){
            const products = await Product.find();
            return res.json(products);
    }else{
            const products = await Product.find({ isAvailable: true });
            return res.json(products);
        }

}catch{
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export async function  deleteProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "Unauthorized: Admin access required" });
        return;
    }
    try {
        const productId = req.params.productId;

        await Product.deleteOne({ productId: productId });

        res.json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Failed to Delete" });
        return
    }
}

export async function updateProduct(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({ message: "Unauthorized: Admin access required" });
        return;
    }

    const data = req.body;
    const productId = req.params.productId;
    data.productId = productId;

    try{
        await Product.updateOne({ productId: productId }, data);
        res.json({ message: "Product updated successfully" });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
}

export async function getProductById(req, res) {
    try {
        const productId = req.params.productId;
        const product=await Product.findOne({ productId: productId });
        if(product == null){
           res.status(404).json({ message: "Product not found" });
           return
        }

        if (isAdmin(req)) {
           res.json(product);
        } else {
          if (product.isAvailable === true){
            res.json(product);
            
          } else {
            res.status(404).json({ message: "Product not found" });
            return;
          }
          
        }

    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function searchProducts(req,res){
	const query = req.params.query

	try{
		const products = await Product.find({
			$or: [ // Search by name or altNames no need to matach both conditions.
				{name:  { $regex:query , $options: "i"}},// $options: "i"  means case insensitive
				{altNames : {$elemMatch : { $regex: query, $options: "i" }}}
			],
			isAvailable: true			
		})
		res.json(products);
	}catch{
		res.status(500).json({ message: "Failed to search products" });
	}

	
}

export async function getProductsBySubPage(req, res) {
    try {
        const subPage = req.params.subPage;
        const products = await Product.find({ subPage, isAvailable: true });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products by subPage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}