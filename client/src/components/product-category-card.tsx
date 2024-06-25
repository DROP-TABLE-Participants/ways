import '../styles/component-styles/product-category-card.scss';

interface ProductCategoryCardProps {
    name: string;
    imageUrl: string;
}

function ProductCategoryCard (props: ProductCategoryCardProps) {
    return (
        <div className="product-card">
            <img src={props.imageUrl} alt={props.name} className="product-card-image" />
            <h3 className="product-card-name">{props.name}</h3>
        </div>
    );
};

export default ProductCategoryCard;