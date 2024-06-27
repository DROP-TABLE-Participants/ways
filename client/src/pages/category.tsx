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
    price: number;
    category: string;
}

function Category() {
    const { name } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [inCart, setInCart] = useState<boolean[]>([]);
    const [quantities, setQuantities] = useState<(number | undefined)[]>([]);
    const navigator = useNavigate();

    const isProductInCart = async (data: {product_id: number, quantity: number}[], id: number )=> {
        return data.some((object: {product_id: number, quantity: number}) => object.product_id === id);
    }
    const getProductQuantity = async (data: {product_id: number, quantity: number}[], id: number) => {
        const product = data.find((object: {product_id: number, quantity: number}) => object.product_id === id);
        return product?.quantity;
    }

    const updateCart = () => {
        fetch(`https://ways-api.azurewebsites.net/api/product?filter_category=${name}`)
            .then(response => response.json())
            .then(async (data: Product[]) => {

                const res = await fetch('https://ways-api.azurewebsites.net/api/cart', {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const resData: {product_id: number, quantity: number}[] = await res.json();

                const productsInCart = await Promise.all(data.map(async (object) => await isProductInCart(resData, object.id)));
                const quantities = await Promise.all(data.map(async (object) => await getProductQuantity(resData, object.id)));

                setInCart(productsInCart);
                setQuantities(quantities);
                setProducts(data.map((object) => ({
                    name: object.name,
                    imageUrl: categoryUrls[name!],
                    price: object.price,
                    id: object.id,
                    category: object.category
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
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Назад</span>
            </button>
            <h1 className="category-heading">{name}</h1>
            <div className="product-list">
                {products?.map((object, i) => 
                    <ProductCard
                    name={object.name}
                    imageUrl={object.imageUrl}
                    key={i}
                    quantity={quantities[i] || 1}
                    price={object.price}
                    id={object.id}
                    inCart={inCart[i]}
                />)}
            </div>
            <CartPanel/>
        </div>
    );
}

export default Category;