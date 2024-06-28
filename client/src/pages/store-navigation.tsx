import { useState, useRef, useEffect } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';
import StoreNavigationCard from '../components/store-navigation-card';
import '../styles/page-styles/store-navigation.scss';
import Map from '../components/map';
import useDeviceOrientation from '../hooks/DeviceOrientation';
import { Product } from './category';
import categoryUrls from '../assets/category-urls';

type CartItem = {
  product: Product | null,
  quantity: number,
  isNext: boolean,
  isAcquired: boolean,
  isGolderEgg: boolean,
  isCheckout: false,
}

function StoreNavigation() {
  const tempImageUrl = "https://www.healthyeating.org/images/default-source/home-0.0/nutrition-topics-2.0/general-nutrition-wellness/2-2-2-3foodgroups_fruits_detailfeature.jpg?sfvrsn=64942d53_4";
  const [isOpen] = useState(true);
  const [availableItems, setAvailableItems] = useState<CartItem[]>([]);
  const [acquiredItems, setAcquiredItems] = useState<CartItem[]>([]);
  const ref = useRef<SheetRef>(null);
  const snapTo = (i: number) => ref.current?.snapTo(i);

  const [tiles, setTiles] = useState([]);
  useEffect(() => {
    fetch(`https://ways-api.codingburgas.bg/api/tile`)
        .then(response => response.json())
        .then((data) => setTiles(data));
}, []);

  const [cartProducts, setCartProducts] = useState([]);
  const [path, setPath] = useState(null)

  useEffect(()=>{

    
    fetch(`https://ways-api.codingburgas.bg/api/pathfinding`, {
      credentials: 'include'
    })
        .then(response => response.json())
        .then(async (data) => {
          setPath(data.path);

          const res = await fetch('https://ways-api.codingburgas.bg/api/cart', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
          });

          const resData: {product_id: number, quantity: number}[] = await res.json();
          
          console.log(resData)

          setAvailableItems(data.products.map((product: any, index: number) => {
            {
              if (index == data.products.length - 1)
              {
                return {
                  product: {name: "Kаса"},
                  quantity: 0,
                  isNext: false,
                  isAcquired: false,
                  isGolderEgg: false,
                  isCheckout: true,
                }
              }
              else if (index == 0) {
                return {
                  product: product.product,
                  quantity: resData.find(el => el.product_id == product.product.id)?.quantity,
                  isNext: true,
                  isAcquired: false,
                  isGolderEgg: product.tile.type == 5,
                  isCheckout: false,
                }
              } else {
                return {
                  product: product.product,
                  quantity: resData.find(el => el.product_id == product.product.id)?.quantity,
                  isNext: false,
                  isAcquired: false,
                  isGolderEgg: product.tile.type == 5,
                  isCheckout: false,
                }
              }
            }
          }))
          data.products.pop();
          setCartProducts(data.products);
        });
  }, [])

  return (
    <div className="content-container">
    
      <div className="map-container">
        <Map tiles={tiles} selectedProducts={cartProducts} path={path}/>
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
                {availableItems.map((item, i) => (
                  <StoreNavigationCard
                    name={item.product?.name!}
                    imageUrl={categoryUrls[availableItems[i].product?.category!]}
                    price={availableItems[i].product?.price!}
                    quantity={availableItems[i].quantity}
                    isNext={i === 0}
                    isAcquired={false}
                    isGoldenEgg={availableItems[i].isGolderEgg}
                    isCheckout={i === availableItems.length - 1}
                    key={i}
                    />
                ))}
                <h4>Взети продукт:</h4>
                {acquiredItems.map((_, i) => (
                  <StoreNavigationCard
                    name={acquiredItems[i].product?.name!}
                    imageUrl={categoryUrls[availableItems[i].product?.category!]}
                    price={availableItems[i].product?.price!}
                    quantity={availableItems[i].quantity}
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
