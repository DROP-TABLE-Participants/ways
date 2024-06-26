import '../styles/component-styles/store-navigation-card.scss';

interface StoreNavigationCardProps {
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    isNext: boolean;
    isAcquired: boolean;
}

function StoreNavigationCard (props: StoreNavigationCardProps) {
    return (
        <div className="product-card">
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <div className="product-card-info-container">
                <p className="product-card-name">{props.name}</p>
                <p className="product-card-price">{props.price} лв.</p>
            </div>
            <div className="product-card-quantity">
                <p className="quantity-number">{props.quantity}</p>
            </div>
        </div>
    );
};

export default StoreNavigationCard;