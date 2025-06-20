import './App.css'
import ProductCard from './components/productCard'
import SuperProduct from './components/superProduct'

function App() {


  return (
    <>
      <div>
        <SuperProduct/>
        <ProductCard 
        name="iPhone 16 pro max" 
        price=" Price:1290$" 
        image="https://picsum.photos/id/1/200/300"/>
        <ProductCard
        name="iPhone 15 pro max" 
        price=" Price:1000$" 
        image="https://picsum.photos/id/2/200/300"/>
        
        
      </div>
    </>
  )
}

export default App
