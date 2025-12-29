export async function searchProducts(req, res) {
  const query = req.params.query;

  try {
    const products = await Product.find({
      isAvailable: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { altName: { $elemMatch: { $regex: query, $options: "i" } } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json([]);
  }
}
