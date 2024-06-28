import { useState, useEffect } from "react"
import './../styles/component-styles/map-product-label.scss'

function ProximityProductPopup({product, onProductCollect} : {product: any, onProductCollect: Function}) {
 
    return (
   <div className="product-popup-container">
    <h1>{product.name}</h1>
    <button onClick={onProductCollect()}>Collect</button>
   </div>
)}

export default ProximityProductPopup;