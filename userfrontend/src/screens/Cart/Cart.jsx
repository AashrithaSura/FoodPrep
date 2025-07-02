import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, addToCart, url } = useContext(StoreContext);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const navigate = useNavigate();

    const calculatedTotalAmount = food_list.reduce((acc, food) => {
        const quantity = cartItems[food._id] || 0;
        return acc + quantity * food.price;
    }, 0);

    const hasItems = calculatedTotalAmount > 0;

    const applyPromo = async () => {
        if (!promoCode) {
            setPromoError('Please enter a promo code');
            return;
        }

        try {
            const response = await axios.get(`${url}/api/promo/validate`, {
                params: {
                    code: promoCode,
                    subtotal: calculatedTotalAmount 
                }
            });
            setAppliedPromo(response.data.promo);
            setPromoError('');
        } catch (error) {
            setAppliedPromo(null);
            setPromoError(error.response?.data?.message || 'Invalid or expired promo code');
        }
    };

    const removePromo = () => {
        setAppliedPromo(null);
        setPromoCode('');
        setPromoError('');
    };

    const getDeliveryFee = () => {
        if (calculatedTotalAmount === 0) return 0;
        if (appliedPromo?.type === 'freeship') return 0;
        return 40;
    };

    const getDiscountAmount = () => {
        if (appliedPromo?.type === 'discount') {
            return calculatedTotalAmount * appliedPromo.value;
        } else if (appliedPromo?.type === 'fixed') {
            return appliedPromo.value;
        }
        return 0;
    };

    const deliveryFee = getDeliveryFee();
    const discountAmount = getDiscountAmount();
    const subtotalAfterDiscount = calculatedTotalAmount - discountAmount;
    const finalTotal = subtotalAfterDiscount + deliveryFee;

    const handleCheckout = () => {
        navigate('/placeorder', { state: { promo: appliedPromo } }); 
    };

    return (
        <div className="cart">
            <div className="cart-items-title">
                <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Modify</p>
            </div>
            <br /> <hr />
            {food_list.map((food) => {
                if (cartItems[food._id] > 0) {
                    return (
                        <div className="cart-items-item" key={food._id}>
                            <img
                                src={`https://foodprepbackend-53br.onrender.com/uploads/${food.image}`}
                                alt={food.name}
                                className="food-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.placeholder_image;
                                }}
                            />
                            <p>{food.name}</p>
                            <p>₹{food.price}</p>
                            <p>{cartItems[food._id]}</p>
                            <p>₹{(cartItems[food._id] * food.price).toFixed(2)}</p>
                            <div className="modify-actions">
                                <button
                                    onClick={() => removeFromCart(food._id)}
                                    className="modify-btn remove-btn"
                                >
                                    <img src={assets.remove_icon_red} alt="Remove" />
                                </button>
                                <span className="quantity-display">{cartItems[food._id]}</span>
                                <button
                                    onClick={() => addToCart(food._id)}
                                    className="modify-btn add-btn"
                                >
                                    <img src={assets.add_icon_green} alt="Add" />
                                </button>
                            </div>
                        </div>
                    );
                }
                return null;
            })}

            <div className="cart-totals-container">
                <h2 className="cart-totals-title">Cart Totals</h2>

                {hasItems && (
                    <>
                        <div className="promo-code-section">
                            <p className="promo-code-label">If you have a promo code, enter it below:</p>
                            <input
                                type="text"
                                placeholder="Enter promo code"
                                className="promo-code-input"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                disabled={appliedPromo}
                            />
                            {appliedPromo ? (
                                <button className="remove-promo-btn" onClick={removePromo}>Remove</button>
                            ) : (
                                <button className="apply-promo-btn" onClick={applyPromo}>Apply</button>
                            )}
                        </div>
                        {promoError && <p className="promo-error">{promoError}</p>}
                        {appliedPromo && (
                            <p className="promo-success">
                                Promo code "{appliedPromo.code}" applied successfully!
                                {appliedPromo.type === 'freeship'
                                    ? ' Free shipping!'
                                    : appliedPromo.type === 'discount'
                                    ? ` ${appliedPromo.value * 100}% discount!`
                                    : ` ₹${appliedPromo.value} off!`}
                            </p>
                        )}
                    </>
                )}

                <div className="cart-totals">
                    <div className="cart-totals-details">
                        <div className="cart-totals-item">
                            <p>Subtotal</p>
                            <p>₹{calculatedTotalAmount.toFixed(2)}</p>
                        </div>

                        {appliedPromo?.type && (
                            <div className="cart-totals-item discount-item">
                                <p>Discount ({appliedPromo.code})</p>
                                <p>-₹{discountAmount.toFixed(2)}</p>
                            </div>
                        )}

                        <div className="cart-totals-item">
                            <p>Delivery Fee</p>
                            <p>{deliveryFee === 0 ? <span className="free-shipping">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</p>
                        </div>

                        <hr />
                        <div className="cart-totals-item grand-total">
                            <p>Total</p>
                            <p>₹{finalTotal.toFixed(2)}</p>
                        </div>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={!hasItems}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
