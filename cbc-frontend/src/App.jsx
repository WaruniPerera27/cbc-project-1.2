import './App.css'
import ProductCard from './components/productCard'
import SuperProduct from './components/SuperProduct'

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-300 flex flex-col items-center p-6 gap-6 ">
        <h1 className="text-4xl font-bold text-gray-800">Featured This week....</h1>
        <SuperProduct />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard
            name="iPhone 16 Pro Max"
            price="1290$"
            image="https://picsum.photos/id/1/200/300"
          />
          <ProductCard
            name="iPhone 15 Pro Max"
            price="1000$"
            image="https://picsum.photos/id/2/200/300"
          />
          <ProductCard
            name="iPhone 11 Pro Max"
            price="900$"
            image="https://picsum.photos/id/3/200/300"
          />
        </div>
      </div>
    </>
  )
}

export default App
