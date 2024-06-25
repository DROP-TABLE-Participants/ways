import React from 'react';

interface ProductCardProps {
    name: string;
    price: number;
    imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl }) => {
    return (
        <div className="product-card">
            <img src={imageUrl} alt={name} className="product-card__image" />
            <h3 className="product-card__name">{name}</h3>
            <p className="product-card__price">${price}</p>
        </div>
    );
};

export default ProductCard;