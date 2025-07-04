import HomePage from './pages/homePage.jsx'
import LoginPage from './pages/loginPage.jsx'
import RegisterPage from './pages/rejisterPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[calc(100vw-5px)] h-[calc(100vh-5px)] bg-green-700">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/*"element={<AdminPage/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
