import {useNavigate} from 'react-router-dom';
import {useOverlayTriggerState} from 'react-stately';
import CartIcon from './icons/cart-icon';
import ProductCartCard from './cart-product-card';
import './../styles/component-styles/cart-panel.scss';
import {A11ySheet} from './a11-sheet';
import {useEffect, useState} from "react";
import categoryUrls from "../assets/category-urls.tsx";

type FetchProduct = {
    id: number;
    name: string;
    quantity: number;
    category: string;
}

type CartProduct = {
  product_id: number;
  quantity: number; 
  product: FetchProduct;
}

function CartPanel() {
  const sheetState = useOverlayTriggerState({});
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  const fetchProdyctById = async (id: number): Promise<FetchProduct> => {
    const res = await fetch(`http://localhost:4000/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    
  return await res.json();
  }
  
  const fetchCartProducts = () => {
    fetch('http://localhost:4000/api/cart', {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(response => response.json())
        .then(async (data: CartProduct[]) => {
          const products = await Promise.all(data.map(async (object) => {
            const product = await fetchProdyctById(object.product_id);
            return {
              product_id: object.product_id,
              quantity: object.quantity,
              product: product
            };
          }));
          setCartProducts(products);
        });
  }
  
  const openSheet = () => {
    fetchCartProducts();
    sheetState.open();
  }

  useEffect(() => {
    fetchCartProducts();
    
    document.addEventListener('cartUpdate', fetchCartProducts);
    
    return () => {
      document.removeEventListener('cartUpdate', fetchCartProducts);
    }
  }, []);
  
  return (
    <>
      <div className="cart-button" onClick={openSheet}>
        <CartIcon/>
      </div>

      <A11ySheet state={sheetState} label="Accessible bottom sheet">
        <div className="sheet-content">
          <div className="cart-products-container">
            <h2>Количка:</h2>
            <div className="scrollable">
              {
                cartProducts.map((object, i) => 
                  <ProductCartCard 
                      id={object.product_id}
                      name={object.product.name}
                      imageUrl={categoryUrls[object.product.category]}
                      price={10}
                      quantity={object.quantity} 
                      key={i} 
                  />)
              }
            </div>
            <div className="cart-product-sum">
              <div className="horizontal-line"></div>
              <div className="cart-product-sum-text">
                <p>Обща сума:</p>
                <p>100 лв.</p>
              </div>
              <div className="cart-product-sum-text">
                <p>Прогнозирано време:</p>
                <p>06:20 минути</p>
              </div>
              <div className="cart-product-sum-text">
                <p>Най-заети часове:</p>
                <p>16:00 - 18:00</p>
              </div>
            </div>
            <div className="cart-call-to-action" onClick={() => {
              sheetState.close();
              navigate('/navigation');
            }}>
              <p>Започни Пазаруване</p>
            </div>
          </div>
        </div>
      </A11ySheet>
    </>
  );
}

export default CartPanel;
