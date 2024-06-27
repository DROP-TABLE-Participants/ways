function QuantityChange(props : {id: number, quantity: number}) {
    const addQuantity =  async (quantity: number) => {
        await fetch('http://localhost:4000/api/cart', {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: props.id,
                quantity: quantity
            })
        })

        document.dispatchEvent(new Event('cartUpdate'));
    }

    const removeQuantity = async (quantity: number) => {
        await fetch('http://localhost:4000/api/cart', {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: props.id,
                quantity: quantity
            })
        })

        document.dispatchEvent(new Event('cartUpdate'));
    }
    
    return (
        <div className="product-card-quantity">
            <button className="quantity-circle-button" onClick={async () => await removeQuantity(1)}>-</button>
            <p className="quantity-number">{props.quantity}</p>
            <button className="quantity-circle-button" onClick={async () => await addQuantity(1)}>+</button>
        </div>
    );
}

export default QuantityChange;