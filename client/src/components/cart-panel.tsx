import { useRef } from 'react';
import { useButton } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';

import CartIcon from './icons/cart-icon';
import ProductCartCard from './cart-product-card';
import './../styles/component-styles/cart-panel.scss';
import { A11ySheet } from './a11-sheet';  // Ensure this path is correct based on your project structure

function CartPanel() {
  const sheetState = useOverlayTriggerState({});

  return (
    <>
      <div className="cart-button" onClick={sheetState.open}>
        <CartIcon />
      </div>

      <A11ySheet state={sheetState} label="Accessible bottom sheet">
        <div className="sheet-content">
          <div className="cart-products-container">
            <h2>Количка:</h2>
            <div className="scrollable">
              <ProductCartCard name="Банани" imageUrl="/public/fruits.jpg" price={10} quantity={2} />
              <ProductCartCard name="Атанаси" imageUrl="/public/fruits.jpg" price={20} quantity={1} />
              <ProductCartCard name="Бориси" imageUrl="/public/fruits.jpg" price={30} quantity={3} />
              <ProductCartCard name="Банани" imageUrl="/public/fruits.jpg" price={10} quantity={2} />
              <ProductCartCard name="Атанаси" imageUrl="/public/fruits.jpg" price={20} quantity={1} />
              <ProductCartCard name="Бориси" imageUrl="/public/fruits.jpg" price={30} quantity={3} />
              <ProductCartCard name="Банани" imageUrl="/public/fruits.jpg" price={10} quantity={2} />
              <ProductCartCard name="Атанаси" imageUrl="/public/fruits.jpg" price={20} quantity={1} />
              <ProductCartCard name="Бориси" imageUrl="/public/fruits.jpg" price={30} quantity={3} />
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
              // Redirect to checkout page
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
