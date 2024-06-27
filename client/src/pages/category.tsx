import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/product-card";
import '../styles/page-styles/category.scss';
import CartPanel from "../components/cart-panel";
import categoryUrls from "../assets/category-urls";

export type Product = {
    id: number;
    name: string;
    imageUrl: string;
    quantity: number;
}

function Category() {
    const { name } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [inCart, setInCart] = useState<boolean[]>([]);
    const [quantities, setQuantities] = useState<number[]>([]); 
    const navigator = useNavigate();

    const isProductInCart = async (id: number) => {
        const res = await fetch('http://localhost:4000/api/cart', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        return data.some((object: {product_id: number, quantity: number}) => object.product_id === id);
    }
    const getProductQuantity = async (id: number) => {
        const res = await fetch('http://localhost:4000/api/cart', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        const product = data.find((object: {product_id: number, quantity: number}) => object.product_id === id);
        return product?.quantity;
    }

    const updateCart = () => {
        fetch(`https://ways-api.azurewebsites.net/api/product/?filter_category=${name}`)
            .then(response => response.json())
            .then(async (data: Product[]) => {
                const productsInCart = await Promise.all(data.map(async (object) => await isProductInCart(object.id)));
                const quantities = await Promise.all(data.map(async (object) => await getProductQuantity(object.id)));
                
                setInCart(productsInCart);
                setQuantities(quantities);
                setProducts(data.map((object) => ({
                    name: object.name,
                    imageUrl: categoryUrls[name!],
                    quantity: object.quantity,
                    id: object.id
                })));
            })
            .catch(error => console.log(error));
    }
        
    
    useEffect(() => {
        updateCart();
        
        document.addEventListener('cartUpdate', updateCart);
        
        return () => {
            document.removeEventListener('cartUpdate', updateCart);
        }
    }, [])
    
    

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
                {products?.map((object, i) => <ProductCard
                    name={object.name}
                    imageUrl={object.imageUrl}
                    key={i}
                    quantity={quantities[i] || 1}
                    price={Math.floor(Math.random() * 29) + 1}
                    id={object.id}
                    inCart={inCart[i]}
                />)}
            </div>
            <CartPanel/>
        </div>
    );
}

export default Category;