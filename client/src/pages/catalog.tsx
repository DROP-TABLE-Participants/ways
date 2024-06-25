import { Component } from 'react';
import '../styles/catalog.scss';
import SearchBar from '../components/search-bar';
import ProductCard from '../components/product-category-card';
import CartButton from '../components/cart-button';

class Catalog extends Component {
    render() {
        return (
            <div className="container">
                <h1>Fill cart:</h1>
                <SearchBar onSearch={(query) => console.log(query)} />
                <div className="product-list">
                    <ProductCard name="Product 1" price={10} imageUrl="https://via.placeholder.com/150" />
                    <ProductCard name="Product 2" price={20} imageUrl="https://via.placeholder.com/150" />
                    <ProductCard name="Product 3" price={30} imageUrl="https://via.placeholder.com/150" />
                    <ProductCard name="Product 4" price={40} imageUrl="https://via.placeholder.com/150" />
                </div>
                <CartButton />
            </div>
        );
    }
}

export default Catalog;