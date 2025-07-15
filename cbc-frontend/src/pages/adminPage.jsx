import { Link, Route,Routes } from "react-router-dom";
import { FaBoxArchive } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import ProductsAdminPage from "./admin/productsAdminPage";
import AddProductPage from "./admin/addProductPage";

export default function AdminPage(){
  return(
    <div className="w-full  h-screen bg-green-400 flex">
       <div className="w-[300px] h-full bg-amber-50">
            <div className="flex flex-col font-bold">
        <span className="text-3xl font-extrabold p-2">Admin Pannel</span><br/>
        <Link className="flex flex-row  items-center gap-2  p-2 " to="/admin/products"><FaBoxArchive />Products</Link>
         <Link className="flex flex-row  items-center gap-2  p-2 " to="/admin/orders"><FaShoppingCart />Orders</Link>
         <Link className="flex flex-row  items-center gap-2 p-2 " to="/admin/users"><FaUserAlt />Users</Link>
       <Link className="flex flex-row  items-center gap-2 p-2"  to="/admin/settings"><IoSettings />Settings</Link>

        </div>
       </div>

                <div className="w-[calc(100%-300px)] bg-gray-400 h-full font-semibold">
                
                <Routes path="/*">

                <Route path="/" element={<h1 className="text-3xl p-2">DashBoard</h1>}/>
                <Route path="/products" element={<ProductsAdminPage/>}/>  
                <Route path="/newProduct" element={<AddProductPage/>}/>
                <Route path="/orders" element={<h1>Orders</h1>}/> 
                <Route path="/users" element={<h1>Users</h1>}/> 
                <Route path="/settings" element={<h1>Settings</h1>}/> 
                 </Routes>

              </div>
      
          </div>

  )
}