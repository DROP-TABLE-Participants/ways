import { Component, useState } from 'react';
import '../styles/page-styles/catalog.scss';
import SearchBar from '../components/search-bar';
import ProductCategoryCard from '../components/product-category-card';
import CartButton from '../components/cart-button';


function Catalog() {
    const [productCategories, setProductCategories] = useState([{ name: 'Product 1', imageUrl: 'https://via.placeholder.com/150' }, { name: 'Product 2', imageUrl: 'https://via.placeholder.com/150' }, { name: 'Product 3', imageUrl: 'https://via.placeholder.com/150' }, { name: 'Product 4', imageUrl: 'https://via.placeholder.com/150'}])
        return (
            <div className="container">
                <h1>Fill cart:</h1>
                <SearchBar onSearch={(query) => console.log(query)} />

                <div className="product-list">
                    {productCategories.map((object, i) => <ProductCategoryCard name={object.name} imageUrl={object.imageUrl} key={i} />)}
                </div>
                <CartButton />
            </div>
        );
}

export default Catalog;