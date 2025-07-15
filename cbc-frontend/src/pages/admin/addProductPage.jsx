import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // Import axios
import toast from "react-hot-toast";

export default function AddProductPage() {
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const inputClass = "w-full p-2 border border-gray-300 rounded";

  const [productId, setProductId] = useState("");
  const [name, setProductName] = useState("");
  const [altName, setAlternativeName] = useState("");
  const [description, setDescription] = useState("");
  const [labledPrice, setLabelledPrice] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImage] = useState([]);
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [category, setCategory] = useState("");
 const navigate = useNavigate(); 

 async function UploadFile(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`http://localhost:5000/uploads/${file.name}`);
    }, 500);
  });
}

async function handleSubmit(e) {
    e.preventDefault();

    const promisesArray = [];

    for (let i = 0; i < images.length; i++) {

     const promise = UploadFile(images[i])
     promisesArray[i] = promise;

    }
    const responses = await Promise.all(promisesArray);
    console.log(responses);

   

    const altNamesInArray = altName.split(",");

    const newProduct = {
      productId,
      name,
      altName: altNamesInArray,
      description,
      labledPrice: labledPrice,
      price,
      stock,
      images: responses,
      category,
      isAvailable,
    };

    console.log("Product added: ", newProduct);

    const token = localStorage.getItem("token");
    if (token == null) {
      window.location.href = "/login";
      return;
    }

    axios
      .post("http://localhost:5000/products", newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        // Optionally reset form or redirect user here
        toast .success("Product added successfully!");
        navigate("/admin/products"); // Navigate to products page after adding

      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Failed to add product. Please try again.");
        
      });
  }

  return (
    <div className="p-10 bg-gray-400 h-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <div className="border-2 border-black w-[800px] h-auto rounded-lg">
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {/* all form fields */}
          <div>
            <label className={labelClass}>Product ID</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className={inputClass}
              placeholder="Enter product ID"
            />
          </div>

          <div>
            <label className={labelClass}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setProductName(e.target.value)}
              className={inputClass}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className={labelClass}>Product Alternative Name</label>
            <input
              type="text"
              value={altName}
              onChange={(e) => setAlternativeName(e.target.value)}
              className={inputClass}
              placeholder="Enter product alternative names"
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div>
            <label className={labelClass}>Labelled Price</label>
            <input
              type="number"
              value={labledPrice}
              onChange={(e) => setLabelledPrice(e.target.value)}
              className={inputClass}
              placeholder="Enter product labelled price"
            />
          </div>

          <div>
            <label className={labelClass}>Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className={labelClass}>Current Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={inputClass}
              placeholder="Current stock"
            />
          </div>

          <div>
            <label className={labelClass}>Image URL</label>
            <input
              multiple
              accept="image/*"
              type="file"
              onChange={(e) => {
                setImage(e.target.files);
                
              }}
              className={inputClass}
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="Enter product category"
            />
          </div>

          <div>
            <label className={labelClass}>Is Available</label>
            <select
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Availability</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          <div className="space-x-2.5">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Product
            </button>
            <Link
              to={"/admin/products"}
              className="text-white px-4 py-2 rounded hover:bg-blue-600 bg-red-500"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
