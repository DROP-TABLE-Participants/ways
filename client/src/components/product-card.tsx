import '../styles/component-styles/product-card.scss';
import AddToCartIcon from '../components/icons/add-to-cart-icon';
import QuantityChange from "./quantity-change.tsx";
import {useEffect, useState} from "react";

interface ProductCardProps {
    id: number
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    inCart: boolean;
}

function ProductCard (props: ProductCardProps) {
    const [inCart, setInCart] = useState<boolean>(props.inCart);
    
    const addToCart = (id: number) => {
        fetch('https://ways-api.azurewebsites.net/api/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({product_id: id, quantity: 1})
        })
            .then(response => response.json())
            .then(() => {
                setInCart(true)
                console.log('cartUpdate');
                document.dispatchEvent(new Event('cartUpdate'));
            })
            .catch(error => console.log(error));

        console.log('cartUpdate');

    }

    useEffect(() => {
        setInCart(props.inCart);
    }, [props.inCart]);
    
    return (
        <div className="product-card">
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <div className="product-card-info-container">
                <p className="product-card-name">{props.name}</p>
                <p className="product-card-price">{props.price} лв.</p>
            </div>
            {inCart ? (
                <QuantityChange id={props.id} quantity={props.quantity} />
            ) : (
                <div className="product-add-to-cart" onClick={() => {
                    addToCart(props.id);
                }}>
                    <AddToCartIcon/>
                </div>
            )}
        </div>
    );
}

export default ProductCard;