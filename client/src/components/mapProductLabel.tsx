import { useState } from "react"
import './../styles/component-styles/map-product-label.scss'

function MapProductLabel({text} : {text: string}) {
    let [state, setState] = useState(false);
    return (
    <div className={`label-container ${state ? 'active' : ''}`} onClick={()=>setState(!state)}>
        <div className={`product-container`}>
            <div className="product-label">
                {text}
            </div>
        </div>
    </div>
)}

export default MapProductLabel