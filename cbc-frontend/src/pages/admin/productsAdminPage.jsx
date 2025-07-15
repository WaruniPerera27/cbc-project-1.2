import { Link } from "react-router-dom";
import {BiPlus} from "react-icons/bi";

export default function ProductsAdminPage() {
  return (
    <div className="w-full bg-gray-400 h-full font-semibold p-4">
      <h1 className="text-3xl mb-4">Products Page</h1>
      <p className="font-semibold ">Add new product</p>
      <Link to={"/admin/newProduct"} className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl ">
        <BiPlus className="text-2xl" />
      </Link>
    </div>
  );
}
