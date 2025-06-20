function ProductCard({ name, price, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform">
      <img src={image} alt={name} className="w-full h-60 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
        <p className="text-lg text-blue-600 font-bold">{price}</p>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Buy Now</button>
      </div>
    </div>
  )
}

export default ProductCard
