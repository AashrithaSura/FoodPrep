import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          subtotal: calculatedTotalAmount,
        },
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
    return 20;
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
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Modify</p>
        </div>
        <br />
        <hr />
        {food_list.map((food) => {
          if (cartItems[food._id] > 0) {
            return (
              <React.Fragment key={food._id}>
                <div className="cart-items-title cart-items-item">
                  <img
                    className="food-image"
                    src={food.image}
                    alt={food.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = assets.placeholder_image;
                    }}
                  />
                  <p>{food.name}</p>
                  <p>₹{food.price}</p>
                  <p>{cartItems[food._id]}</p>
                  <p>₹{(cartItems[food._id] * food.price).toFixed(2)}</p>
                  <div className="cart-counter food-item-counter">
                    <img
                      onClick={() => removeFromCart(food._id)}
                      src={assets.remove_icon_red}
                      alt="Remove"
                    />
                    <p>{cartItems[food._id]}</p>
                    <img
                      onClick={() => addToCart(food._id)}
                      src={assets.add_icon_green}
                      alt="Add"
                    />
                  </div>
                </div>
                <hr />
              </React.Fragment>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{calculatedTotalAmount.toFixed(2)}</p>
            </div>

            {appliedPromo?.type && (
              <div className="cart-total-details">
                <p>Discount ({appliedPromo.code})</p>
                <p>-₹{discountAmount.toFixed(2)}</p>
              </div>
            )}

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee === 0 ? <span className="free-shipping">FREE</span> : `₹${deliveryFee.toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{finalTotal.toFixed(2)}</p>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={!hasItems}>
            Proceed to Checkout
          </button>
        </div>

        <div className="cart-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cart-promocode-input">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={!!appliedPromo}
            />
            {appliedPromo ? (
              <button onClick={removePromo}>Remove</button>
            ) : (
              <button onClick={applyPromo}>Apply</button>
            )}
          </div>
          {promoError && <p className="promo-error">{promoError}</p>}
          {appliedPromo && (
            <p className="promo-success">
              Promo "{appliedPromo.code}" applied —{" "}
              {appliedPromo.type === 'freeship'
                ? "Free shipping"
                : appliedPromo.type === 'discount'
                  ? `${appliedPromo.value * 100}% OFF`
                  : `₹${appliedPromo.value} OFF`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
