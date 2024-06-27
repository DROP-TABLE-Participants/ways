import '../styles/component-styles/product-category-card.scss';

interface ProductCategoryCardProps {
    name: string;
    imageUrl: string;
    onClick?: () => void;
    index: number;
}

function ProductCategoryCard (props: ProductCategoryCardProps) {
    return (
        <div className="product-category-card" onClick={props.onClick} style={{animationDelay:`${props.index * 40}ms`}}>
            <img src={props.imageUrl} alt={props.name} className="product-category-card-image" />
            <h3 className="product-category-card-name">{props.name}</h3>
        </div>
    );
};

export default ProductCategoryCard;