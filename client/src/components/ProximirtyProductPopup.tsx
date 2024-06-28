import { useState, useEffect } from "react"
import './../styles/component-styles/map-product-label.scss'


function ProximityProductPopup({product, onProductCollect} : {product: any, onProductCollect: any}) {
    useEffect(()=>{
        console.log('hello')
    }, [])
 
    return (
    <div className="product-popup-container">
        <h1>{product.name}</h1>
        <div onClick={onProductCollect}>Collect</div>
    </div>
    )}

export default ProximityProductPopup;