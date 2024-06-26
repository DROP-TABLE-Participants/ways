import { useState, useRef } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import StoreNavigationCard from '../components/store-navigation-card';
import '../styles/page-styles/store-navigation.scss';
import Map from '../components/map';

function StoreNavigation() {
  const tempImageUrl = "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4";
  const [isOpen] = useState(true);
  const [availableItems] = useState([
    { name: "Банани", quantity: 2, imageUrl: tempImageUrl, price: 10, isNext: false, isAcquired: false, isGoldenEgg: false, isCheckout: false },
    { name: "Атанани", quantity: 3, imageUrl: tempImageUrl, price: 15, isNext: false, isAcquired: false, isGoldenEgg: true, isCheckout: false },
    { name: "Борани", quantity: 3, imageUrl: tempImageUrl, price: 15, isNext: false, isAcquired: false, isGoldenEgg: false, isCheckout: false }

  ]);
  const [acquiredItems] = useState([
    { name: "Калани", quantity: 2, imageUrl: tempImageUrl, price: 10, isNext: false, isAcquired: true, isGoldenEgg: false, isCheckout: false },
    { name: "Стояни", quantity: 3, imageUrl: tempImageUrl, price: 15, isNext: false, isAcquired: true, isGoldenEgg: false, isCheckout: false },
    { name: "Никиани", quantity: 3, imageUrl: tempImageUrl, price: 15, isNext: false, isAcquired: true, isGoldenEgg: false, isCheckout: false }
  ]);
  const ref = useRef<SheetRef>(null);
  const snapTo = (i: number) => ref.current?.snapTo(i);

  let selected_products = [{x:'27', y:'4', name: 'Borisi'}, {x:'33', y:'3', name: 'Atanasi'}, {x:'35', y:'20', name: 'Kalini'}]

  return (
    <div className="content-container">
      
      <div className="map-container">
        <Map selectedProducts={selected_products}/>
      </div>


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
                {availableItems.map((_, i) => (
                  <StoreNavigationCard
                    name={availableItems[i].name}
                    imageUrl={availableItems[i].imageUrl}
                    price={availableItems[i].price}
                    quantity={availableItems[i].quantity}
                    isNext={i === 0}
                    isAcquired={false}
                    isGoldenEgg={availableItems[i].isGoldenEgg}
                    isCheckout={false}
                    key={i}
                    />
                ))}
                <h4>Взети продукт:</h4>
                {acquiredItems.map((_, i) => (
                  <StoreNavigationCard
                    name={acquiredItems[i].name}
                    imageUrl={acquiredItems[i].imageUrl}
                    price={acquiredItems[i].price}
                    quantity={acquiredItems[i].quantity}
                    isNext={false}
                    isAcquired={true}
                    isGoldenEgg={false}
                    isCheckout={false}
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
