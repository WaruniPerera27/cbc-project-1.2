import { Routes, Route } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>
      <div className="w-full h-screen bg-teal-700 flex">
        <div className="w-[300px] h-full bg-white"></div>
        <div className="w-[calc(100%-300px)] h-full bg-green-500">
          <Routes>
            <Route path="/" element={<h1>Admin Dashboard</h1>} />
            <Route path="/products/*" element={<h1>Products</h1>} />✏️
          </Routes>
        </div>
      </div>
    </div>
  );
}
