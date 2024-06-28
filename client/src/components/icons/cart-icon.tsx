import {useEffect, useState} from "react";

function CartIcon() {
    const [numberOfPRoducts, setNumberOfProducts] = useState(0);
    
    const fetchNumberOfProducts = () => {
        fetch('https://ways-api.codingburgas.bg/api/cart', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data: {product_id: number, quantity: number}[]) => {
                console.log(data, data.length)
                setNumberOfProducts(data.length);
            });
    }
    
    useEffect(() => {
        fetchNumberOfProducts();
        
        document.addEventListener('cartUpdate', () => {
            fetchNumberOfProducts();
        })
        
        return () => {
            document.removeEventListener('cartUpdate', () => {
                fetchNumberOfProducts();
            });
        }
    }, []);
    
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.7883 2.50242C29.8144 2.12184 28.7238 2.05841 27.3263 2.04818C27.036 1.43531 26.5777 0.917446 26.0047 0.554855C25.4316 0.192265 24.7674 -0.000149605 24.0893 4.33622e-07H15.9048C15.2268 -0.000333123 14.5628 0.191776 13.9898 0.553991C13.4167 0.916206 12.9583 1.43364 12.6678 2.04614C11.2682 2.05841 10.1797 2.12184 9.20571 2.50242C8.04304 2.95722 7.03188 3.73013 6.28792 4.73271C5.53699 5.74146 5.18301 7.0387 4.70012 8.82089L3.41515 13.5331C2.60945 13.9381 1.90362 14.5167 1.34855 15.2273C0.075855 16.8581 -0.149219 18.7999 0.0779015 21.0261C0.296838 23.1868 0.978201 25.9082 1.82939 29.3129L1.88259 29.5319C2.42277 31.6844 2.8586 33.4338 3.37832 34.7986C3.92054 36.2227 4.61009 37.389 5.74365 38.275C6.87925 39.161 8.17855 39.5436 9.69064 39.7278C11.1393 39.8996 12.944 39.8996 15.1641 39.8996H24.83C27.0501 39.8996 28.8527 39.8996 30.3034 39.7257C31.8175 39.5457 33.1148 39.161 34.2484 38.273C35.384 37.389 36.0715 36.2227 36.6137 34.7986C37.1355 33.4338 37.5713 31.6844 38.1094 29.5298L38.1647 29.315C39.0159 25.9082 39.6952 23.1868 39.9162 21.0281C40.1412 18.7978 39.9161 16.8581 38.6435 15.2273C38.089 14.5169 37.3839 13.9383 36.5789 13.5331L35.2939 8.82089C34.809 7.0387 34.455 5.74145 33.7061 4.73066C32.9619 3.72884 31.9508 2.95666 30.7883 2.50242ZM10.3229 5.36087C10.773 5.18491 11.3173 5.13375 12.6698 5.11943C13.2468 6.32665 14.4786 7.16147 15.9027 7.16147H24.0872C25.5154 7.16147 26.7472 6.32665 27.3242 5.11943C28.6767 5.13375 29.221 5.18491 29.6712 5.36087C30.2973 5.60641 30.8415 6.02178 31.2426 6.56195C31.6027 7.04689 31.8135 7.72416 32.4089 9.90739L33.1332 12.5612C31.0093 12.2768 28.2675 12.2768 24.8607 12.2768H15.1313C11.7265 12.2768 8.98473 12.2768 6.86084 12.5612L7.58517 9.90739C8.17855 7.72416 8.39135 7.04689 8.75147 6.56195C9.15212 6.022 9.69671 5.60576 10.3229 5.36087ZM15.9048 3.0692C15.7691 3.0692 15.639 3.1231 15.543 3.21903C15.4471 3.31496 15.3932 3.44507 15.3932 3.58074C15.3932 3.7164 15.4471 3.84651 15.543 3.94245C15.639 4.03838 15.7691 4.09227 15.9048 4.09227H24.0893C24.225 4.09227 24.3551 4.03838 24.451 3.94245C24.5469 3.84651 24.6008 3.7164 24.6008 3.58074C24.6008 3.44507 24.5469 3.31496 24.451 3.21903C24.3551 3.1231 24.225 3.0692 24.0893 3.0692H15.9048ZM3.76913 17.1159C4.34 16.3854 5.24235 15.8944 7.10433 15.6243C9.00928 15.3501 11.5915 15.346 15.2602 15.346H24.7338C28.4025 15.346 30.9827 15.3501 32.8877 15.6243C34.7517 15.8944 35.654 16.3854 36.2249 17.118C36.7958 17.8484 37.0536 18.8408 36.8613 20.7151C36.6669 22.6303 36.0449 25.1347 35.1548 28.695C34.588 30.9621 34.1931 32.5335 33.7471 33.708C33.3133 34.8416 32.8897 35.4411 32.3598 35.8565C31.8298 36.2698 31.1444 36.5337 29.9392 36.679C28.691 36.8284 27.0746 36.8304 24.7338 36.8304H15.2602C12.9194 36.8304 11.301 36.8284 10.0549 36.679C8.84764 36.5358 8.16423 36.2698 7.63428 35.8565C7.10228 35.4411 6.67873 34.8416 6.247 33.708C5.80094 32.5335 5.40604 30.9621 4.83721 28.695C3.94919 25.1347 3.32512 22.6303 3.13073 20.7151C2.94044 18.8408 3.19826 17.8464 3.76913 17.1159Z" fill="white"/>
            </svg>
            <p style={
                {
                position: "absolute",
                top: "43%",
                left: "43%",
                color: "white"
                }
            
            }>{numberOfPRoducts}</p>
        </>
    );
};

export default CartIcon;