import { Sheet } from 'react-modal-sheet';
import { useState } from 'react';
import CartIcon from './icons/cart-icon';
import './../styles/component-styles/cart-panel.scss'

function CartPanel() {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="cart-button" onClick={()=>setOpen(true)}>
        <CartIcon />
      </div>


      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header>Cart:</Sheet.Header>
          <Sheet.Content>
            <div className="cart-items-list">
              <div className="cart-item">
                <div className="cart-item-image">
                  <img src="public/fruits.jpg" alt="product" />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">Product name</div>
                  <div className="cart-item-price">Price: 10$</div>
                </div>
                <div className="cart-item-quantity">
                  <input type="number" defaultValue="1" />
                </div>
                <div className="cart-item-remove">
                  <button>Remove</button>
                </div>
              </div>
            </div> 
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}

export default CartPanel;