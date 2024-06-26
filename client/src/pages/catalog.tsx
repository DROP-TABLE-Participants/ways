import { useState } from 'react';
import '../styles/page-styles/catalog.scss';
import SearchBar from '../components/search-bar';
import ProductCategoryCard from '../components/product-category-card';
import CartPanel from '../components/cart-panel';

function Catalog() {
    const tempImageUrl = "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4";
    const [productCategories] = useState([{ name: 'Плодове', imageUrl: tempImageUrl }, { name: 'Плодове', imageUrl: tempImageUrl }, { name: 'Плодове', imageUrl: tempImageUrl }, { name: 'Плодове', imageUrl: tempImageUrl}, { name: 'Плодове', imageUrl: tempImageUrl}, { name: 'Плодове', imageUrl: tempImageUrl}, { name: 'Плодове', imageUrl: tempImageUrl}, { name: 'Плодове', imageUrl: tempImageUrl}])

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