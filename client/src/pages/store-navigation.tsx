import React, { useState, useRef } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import ProductCartCard from '../components/cart-product-card';
import '../styles/page-styles/store-navigation.scss';

function StoreNavigation() {
  const [isOpen, setOpen] = useState(true);
  const [boxes, setBoxes] = useState([0, 1, 2, 3]);
  const ref = useRef<SheetRef>(null);
  const snapTo = (i: number) => ref.current?.snapTo(i);

  return (
    <div className="container">
      <Sheet
        ref={ref}
        isOpen={isOpen}
        initialSnap={0}
        snapPoints={[-50, 200, 0]}
        detent="content-height"
        onOpenEnd={() => snapTo(1)}
        onClose={()=>{snapTo(1)}}
      >
        <Sheet.Container>
          <Sheet.Header/>
          <Sheet.Content>
            <Sheet.Scroller>
              <div className="sheet-content">
                <h4>Следващ продукт:</h4>
                {boxes.map((_, i) => (
                  <ProductCartCard
                    name="Банани"
                    imageUrl="/public/fruits.jpg"
                    price={10}
                    quantity={2}
                    key={i}
                    />
                ))}
              </div>
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
}

export default StoreNavigation;
