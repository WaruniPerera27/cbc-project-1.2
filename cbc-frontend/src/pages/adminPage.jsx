import { Route,Routes } from "react-router-dom";
export default function AdminPage(){
  return(
    <div className="w-full  h-screen bg-green-400 flex">
       <div className="w-[300px] h-full bg-amber-50"></div>
                <div className="w-[calc(100%-300px)] bg-blue-400 h-full">

                <Routes path="/*">

                <Route path="/" element={<h1>DashBoard</h1>}/>
                <Route path="/products" element={<h1>Products</h1>}/>  
                
                 </Routes>

              </div>
      
          </div>

  )
}