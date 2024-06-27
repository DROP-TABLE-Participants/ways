import { useEffect, useState } from 'react';
import '../styles/page-styles/catalog.scss';
import SearchBar from '../components/search-bar';
import ProductCategoryCard from '../components/product-category-card';
import CartPanel from '../components/cart-panel';
import categoryUrls from '../assets/category-urls.jsx'
import ProductCard from "../components/product-card.tsx";
import {Product} from "./category.tsx";
import {useNavigate} from "react-router-dom";

type ProductCategory = {
    name: string;
    imageUrl: string;
}

function Catalog() {
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [inCart, setInCart] = useState<boolean[]>([]);
    const [quantities, setQuantities] = useState<(number | undefined)[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigator = useNavigate();
    
    useEffect(() => {
        fetch('https://ways-api.azurewebsites.net/api/product/categories')
            .then(response => response.json())
            .then((data: string[]) => setProductCategories(
                data.map(item => ({name: item, imageUrl: categoryUrls[item]}))
            ));
    }, []);

    const isProductInCart = async (data: {product_id: number, quantity: number}[], id: number )=> {
        return data.some((object: {product_id: number, quantity: number}) => object.product_id === id);
    }
    const getProductQuantity = async (data: {product_id: number, quantity: number}[], id: number) => {
        const product = data.find((object: {product_id: number, quantity: number}) => object.product_id === id);
        return product?.quantity;
    }

    const updateCart = () => {
        fetch(`https://ways-api.azurewebsites.net/api/product?search=${searchQuery}`)
            .then(response => response.json())
            .then(async (data: Product[]) => {

                const res = await fetch('https://ways-api.azurewebsites.net/api/cart', {
                    credentials: 'include',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const resData: {product_id: number, quantity: number}[] = await res.json();

                const productsInCart = await Promise.all(data.map(async (object) => await isProductInCart(resData, object.id)));
                const quantities = await Promise.all(data.map(async (object) => await getProductQuantity(resData, object.id)));

                setInCart(productsInCart);
                setQuantities(quantities);
                setProducts(data.map((object) => ({
                    name: object.name,
                    imageUrl: categoryUrls[object.category!],
                    quantity: object.quantity,
                    id: object.id,
                    category: object.category
                })));
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        updateCart();

        document.addEventListener('cartUpdate', updateCart);

        return () => {
            document.removeEventListener('cartUpdate', updateCart);
        }
    }, [searchQuery])
    
    return (
            <div className="container">
                <h1 className="catalog-heading">Добави продукти:</h1>
                <div className='content'>
                    <SearchBar onSearch={setSearchQuery} query={searchQuery} />
                        {
                            searchQuery === "" ?
                                <div className="category-list">
                                    {productCategories?.map((object, i) => 
                                        <ProductCategoryCard 
                                            name={object.name}
                                            index={i} 
                                            imageUrl={object.imageUrl} 
                                            key={i} 
                                            onClick={() => {
                                                navigator(`/category/${object.name}`);
                                            }}
                                        />
                                    )}
                                </div>
                                :
                                <div className="product-list">
                                    {products?.map((object, i) =>
                                        <ProductCard
                                            name={object.name}
                                            imageUrl={object.imageUrl}
                                            key={i}
                                            quantity={quantities[i] || 1}
                                            price={Math.floor(Math.random() * 29) + 1}
                                            id={object.id}
                                            inCart={inCart[i]}
                                        />
                                    )}
                                </div>
                        }
                            </div>
                    
                    <CartPanel/>
                </div>
        );
}

export default Catalog;