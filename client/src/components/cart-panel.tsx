import {useNavigate} from 'react-router-dom';
import {useOverlayTriggerState} from 'react-stately';
import CartIcon from './icons/cart-icon';
import ProductCartCard from './cart-product-card';
import './../styles/component-styles/cart-panel.scss';
import {A11ySheet} from './a11-sheet';
import {useEffect, useState} from "react";
import categoryUrls from "../assets/category-urls.tsx";
import busyHoursData from '../assets/busy-hours.json';

type FetchProduct = {
    id: number;
    name: string;
    quantity: number;
    category: string;
    price: number;
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

  const givePermissions = async () => {
    /*
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const orientationPermission = await DeviceOrientationEvent.requestPermission();
            if (orientationPermission === 'granted') {

            } else {
                console.error('Permission for device orientation was denied');
            }
        } catch (error) {
            console.error('Error requesting device orientation permission:', error);
        }
    } else {

    }
    */
}
  const [busyHours, setBusyHours] = useState<string>('16:00 - 18:00');

  const fetchProductById = async (id: number): Promise<FetchProduct> => {
    const res = await fetch(`https://ways-api.codingburgas.bg/api/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return await res.json();
  }
  
  const fetchCartProducts = () => {
    fetch('https://ways-api.codingburgas.bg/api/cart', {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(response => response.json())
        .then(async (data: CartProduct[]) => { 
          const products = await Promise.all(data.map(async (object) => {
            const product = await fetchProductById(object.product_id);
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
    fetchBusyHours();
    
    document.addEventListener('cartUpdate', fetchCartProducts);
    
    return () => {
      document.removeEventListener('cartUpdate', fetchCartProducts);
    }
  }, []);
  
  const calculateTotalPrice = () => {
    return cartProducts.reduce((total, object) => total + object.product.price * object.quantity, 0);
  }

  const calculateEstimatedTime = () => {
    const uniqueProductCount = cartProducts.length * 2;
    return uniqueProductCount;
  }
  
  const fetchBusyHours = () => {
    const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
    const busyHour: { day: string, hours: string } | undefined = busyHoursData.busy_hours.find((bh: { day: string }) => bh.day === currentDay);
    if (busyHour) {
      setBusyHours(busyHour.hours);
    }
  }

  const totalPrice = calculateTotalPrice();
  const estimatedTime = calculateEstimatedTime();

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
                      price={object.product.price}
                      quantity={object.quantity} 
                      key={i} 
                  />)
              }
            </div>
            <div className="cart-product-sum">
              <div className="horizontal-line"></div>
              <div className="cart-product-sum-text">
                <p>Обща сума:</p>
                <p>{totalPrice.toFixed(2)} лв.</p>
              </div>
              <div className="cart-product-sum-text">
                <p>Прогнозирано време:</p>
                <p>{estimatedTime} минути</p>
              </div>
              <div className="cart-product-sum-text">
                <p>Най-заети часове:</p>
                <p>{busyHours}</p>
              </div>
            </div>
            <div className="cart-call-to-action" onClick={() => {
             givePermissions();
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
