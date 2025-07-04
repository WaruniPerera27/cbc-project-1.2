import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import AdminPage from "./pages/adminPage.jsx";
import HomePage from "./pages/homePage.jsx";
import LoginPage from "./pages/loginPage.jsx";
import RegisterPage from "./pages/rejisterPage.jsx"
import TestPage from "./pages/testPage.jsx";



function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen flex items-center justify-center">
   
          <Routes path="/">
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/*"element={<AdminPage/>}/>  {/*The * acts as a wildcard matcher in React Router
                 It means:Match any sub-routes under /admin/ — no matter what comes after it.*/}
          </Routes>
        </div>
   
    </BrowserRouter>  

            )
          
          }
  export default App