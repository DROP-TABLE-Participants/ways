
function CartButton() {
    return (
        <div className="cart-button">
            <button className="cart-button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M19 7h-2V6a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9h1a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zM9 6h6v1H9V6zm7 12H8v-7h8v7zm2-8H6V8h12v2z" />
                </svg>
            </button>
        </div>
    );
};

export default CartButton;