import { useState, useRef } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import StoreNavigationCard from '../components/store-navigation-card';
import '../styles/page-styles/store-navigation.scss';

function StoreNavigation() {
  const [isOpen] = useState(true);
  const [boxes] = useState([0, 1, 2, 3]);
  const ref = useRef<SheetRef>(null);
  const snapTo = (i: number) => ref.current?.snapTo(i);
  const tempImageUrl = "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4";

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
                  <StoreNavigationCard
                    name="Банани"
                    imageUrl={tempImageUrl}
                    price={10}
                    quantity={2}
                    isNext={i === 0}
                    isAcquired={false}
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
