import '../styles/component-styles/cart-product-card.scss';

interface ProductCartCardProps {
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
            <div className="product-card-quantity">
                <button className="quantity-circle-button">-</button>
                <p className="quantity-number">{props.quantity}</p>
                <button className="quantity-circle-button">+</button>
            </div>
        </div>
    );
};

export default ProductCartCard;