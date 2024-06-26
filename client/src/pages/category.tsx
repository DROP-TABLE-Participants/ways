import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/product-card";
import '../styles/page-styles/category.scss';
import CartPanel from "../components/cart-panel";

type Product = {
    name: string;
    imageUrl: string;
    quantity: number;
}

function Category() {
    const { name } = useParams();
    const [products, setProducts] = useState<Product[]>();
    const navigator = useNavigate();

    const tempImageUrl = "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4";
    
    useEffect(() => {
        fetch(`https://ways-api.azurewebsites.net/api/product/?filter_category=${name}`)
            .then(response => response.json())
            .then((data: Product[] )=> setProducts(() => data.map((object) => ({ name: object.name, imageUrl: tempImageUrl, quantity: object.quantity }))))
            .catch(error => console.log(error));
    }, []);

    return (
        <div className="container">
            <button className="back-button" onClick={() => {navigator(`/`);}}>
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Назад</span>
            </button>
            <h1 className="category-heading">{name}</h1>
            <div className="product-list">
                {products?.map((object, i) => <ProductCard name={object.name} imageUrl={object.imageUrl} key={i} quantity={object.quantity} price={Math.floor(Math.random() * 30)} />)}
            </div>
            <CartPanel/>             
        </div>
    );
}

export default Category;