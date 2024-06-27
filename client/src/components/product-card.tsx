import '../styles/component-styles/product-card.scss';
import AddToCartIcon from '../components/icons/add-to-cart-icon';

interface ProductCardProps {
    name: string;
    imageUrl: string;
    price: number;
    quantity?: number;
    inCart?: boolean;
    index: number
}

function ProductCard (props: ProductCardProps) {
    return (
        <div className="product-card" style={{animationDelay: `${props.index * 40}ms`}}>
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <div className="product-card-info-container">
                <p className="product-card-name">{props.name}</p>
                <p className="product-card-price">{props.price} лв.</p>
            </div>
            {props.inCart ? (
                <div className="product-card-quantity">
                    <button className="quantity-circle-button">-</button>
                    <p className="quantity-number">{props.quantity}</p>
                    <button className="quantity-circle-button">+</button>
                </div>
            ) : (
                <div className="product-add-to-cart">
                    <AddToCartIcon/>
                </div>
            )}
        </div>
    );
};

export default ProductCard;