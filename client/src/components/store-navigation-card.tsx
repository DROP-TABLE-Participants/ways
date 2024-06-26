import '../styles/component-styles/store-navigation-card.scss';
import CheckmarkIcon from '../components/icons/checkmark-icon';
import StarkIcon from '../components/icons/star-icon';


interface StoreNavigationCardProps {
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
    isNext: boolean;
    isGoldenEgg: boolean;
    isAcquired: boolean;
    isCheckout: boolean;
}

function StoreNavigationCard (props: StoreNavigationCardProps) {
    var cardClassName = "";
    if (props.isNext) {
        cardClassName = "product-card-next";
    }
    else if (props.isAcquired) {
        cardClassName = " product-card-acquired";
    }
    else {
        cardClassName = " product-card-regular";
    }

    if (props.isGoldenEgg) {
        cardClassName += " product-card-golden-egg";
    }
    return (
        <div className={"product-card " + cardClassName}>
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <div className="product-card-info-container">
                <p className="product-card-name">{props.name}</p>
                <p className="product-card-price">{props.price} лв.</p>
            </div>
            <div className="product-card-quantity">
                <p className="quantity-number">{props.quantity}</p>
            </div>
            <div className="product-card-icon-check">
                <CheckmarkIcon />
            </div>
            <div className="product-card-icon-star">
                <StarkIcon />
            </div>
        </div>
    );
};

export default StoreNavigationCard;