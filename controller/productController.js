import Product from '../models/products.js';
import { isAdmin } from './userController.js';

/* ================= CREATE PRODUCT ================= */
export async function createProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }

  const product = new Product(req.body);

  try {
    const response = await product.save();
    res.json({
      message: "Product created successfully",
      product: response
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= GET PRODUCTS ================= */
export async function getProducts(req, res) {
  try {
    const products = isAdmin(req)
      ? await Product.find()
      : await Product.find({ isAvailable: true });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= DELETE PRODUCT ================= */
export async function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }

  try {
    const productId = req.params.productId;

    await Product.deleteOne({ _id: productId });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
}

/* ================= UPDATE PRODUCT ================= */
export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Unauthorized: Admin access required" });
  }

  try {
    const productId = req.params.productId;

    await Product.updateOne(
      { _id: productId },
      { $set: req.body }
    );

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
}

/* ================= GET PRODUCT BY ID ================= */
export async function getProductById(req, res) {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (isAdmin(req) || product.isAvailable === true) {
      return res.json(product);
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/* ================= SEARCH PRODUCTS ================= */
export async function searchProducts(req, res) {
  const query = req.params.query;

  try {
    const products = await Product.find({
      isAvailable: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { altName: { $elemMatch: { $regex: query, $options: "i" } } } // ✅ FIXED
      ]
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Failed to search products" });
  }
}

/* ================= PRODUCTS BY SUB PAGE ================= */
export async function getProductsBySubPage(req, res) {
  try {
    const subPage = req.params.subPage;
    const products = await Product.find({
      subPage,
      isAvailable: true
    });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products by subPage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
