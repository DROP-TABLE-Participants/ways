import { useState } from 'react';
import '../styles/page-styles/catalog.scss';
import SearchBar from '../components/search-bar';
import ProductCategoryCard from '../components/product-category-card';
import CartPanel from '../components/cart-panel';
import CartIcon from '../components/icons/cart-icon';


function Catalog() {
    const [productCategories, setProductCategories] = useState([{ name: 'Плодове', imageUrl: 'public/fruits.jpg' }, { name: 'Плодове', imageUrl: 'public/fruits.jpg' }, { name: 'Плодове', imageUrl: 'public/fruits.jpg' }, { name: 'Плодове', imageUrl: 'public/fruits.jpg'}, { name: 'Плодове', imageUrl: 'public/fruits.jpg'}, { name: 'Плодове', imageUrl: 'public/fruits.jpg'}, { name: 'Плодове', imageUrl: 'public/fruits.jpg'}, { name: 'Плодове', imageUrl: 'public/fruits.jpg'}])
    const [cartPopupState, setCartPopupState] = useState(false)

    const onCartButtonClick = () => {
        setCartPopupState(!cartPopupState)
    }

        return (
            <div className="container">
                <h1 className="catalog-heading">Добави продукти:</h1>
                <div className='content'>
                    <SearchBar onSearch={(query) => console.log(query)} />
                    <div className="product-list">
                        {productCategories.map((object, i) => <ProductCategoryCard name={object.name} imageUrl={object.imageUrl} key={i} />)}
                    </div>
                    
                    <CartPanel/>
                </div>
            </div>
        );
}

export default Catalog;