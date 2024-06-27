import '../styles/component-styles/cart-product-card.scss';
import QuantityChange from "./quantity-change";

interface ProductCartCardProps {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
}

function ProductCartCard (props: ProductCartCardProps) {
    return (
        <div className="product-card">
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <div className="product-card-info-container">
                <p className="product-card-name">{props.name}</p>
                <p className="product-card-price">{props.price} лв.</p>
            </div>
           <QuantityChange id={props.id} quantity={props.quantity} />
        </div>
    );
}

export default ProductCartCard;