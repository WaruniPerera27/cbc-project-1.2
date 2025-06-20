import "./productCard.css";
export default function ProductCard(props){
console.log(props);
    return(
        <div className="card border text">
            <h1>{props.name}</h1>
            <img src={props.image}></img>
            <p>{props.price}</p>
            <button>Add to Cart</button>
        </div>
    )
}