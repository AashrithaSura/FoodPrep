import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PlaceOrder.css';
import Loader from '../../components/Loader/Loader';

const PlaceOrder = () => {
  const [data, setData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    phone: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { getTotalCartAmount, food_list, cartItems, url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    } else if (location.state?.promo) {
      setAppliedPromo(location.state.promo);
    }
  }, [token, getTotalCartAmount, location.state]);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoMessage("Please enter a promo code");
      return;
    }

    setIsValidatingPromo(true);
    setPromoMessage('');
    setError(null);

    try {
      const subtotal = getTotalCartAmount();
      const response = await axios.get(`${url}/api/promo/validate`, {
        params: {
          code: promoCode.trim(),
          subtotal
        },
        headers: { token }
      });

      setAppliedPromo(response.data.promo);
      setPromoMessage(`Promo "${response.data.promo.code}" applied successfully!`);
    } catch (error) {
      console.error("Promo validation error:", error);
      setPromoMessage(error.response?.data?.message || "Invalid or expired promo code");
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const getDeliveryFee = () => {
    return appliedPromo?.type === 'freeship' ? 0 : 40;
  };

  const getDiscountAmount = () => {
    const subtotal = getTotalCartAmount();
    if (!appliedPromo) return 0;

    switch(appliedPromo.type) {
      case 'discount':
        return (subtotal * (appliedPromo.value));
      case 'fixed':
        return Math.min(appliedPromo.value, subtotal);
      default:
        return 0;
    }
  };

  const getFinalAmount = () => {
    const subtotal = getTotalCartAmount();
    const discount = getDiscountAmount();
    const delivery = getDeliveryFee();
    return Math.max(0, subtotal - discount + delivery);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['first_name', 'last_name', 'email', 'street', 'city', 'state', 'zip_code', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field].trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!/^\d{10}$/.test(data.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    setError(null);
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id]
      }));

    const orderData = {
      address: data,
      items: orderItems,
      promo: appliedPromo?.code || null,
      amount: getFinalAmount(),
      subtotal: getTotalCartAmount(),
      discount: getDiscountAmount(),
      deliveryFee: getDeliveryFee()
    };

    try {
      console.log('Submitting order:', orderData); 
      
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.session_url) {
        window.location.replace(response.data.session_url);
      } else {
        throw new Error('No session URL received');
      }
    } catch (error) {
      console.error("Detailed Order placement error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      if (error.response?.data?.message?.includes('promo')) {
        setPromoMessage(error.response.data.message);
        setAppliedPromo(null);
      }
      
      setError(error.response?.data?.message || 
               error.response?.data?.error || 
               'Failed to proceed to payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) return <Loader />;

  return (
    <form onSubmit={onSubmitHandler} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        {error && <div className="error-message">{error}</div>}
        <div className="multi-fields">
          <input required name="first_name" value={data.first_name} onChange={onChangeHandler} type="text" placeholder="First Name" />
          <input required name="last_name" value={data.last_name} onChange={onChangeHandler} type="text" placeholder="Last Name" />
        </div>
        <input required name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email address" />
        <input required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" />
          <input required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zip_code" value={data.zip_code} onChange={onChangeHandler} type="text" placeholder="Zip code" />
          <input required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" />
        </div>
        <input required name="phone" value={data.phone} onChange={onChangeHandler} type="tel" placeholder="Phone" pattern="[0-9]{10}" />

        <div className="promo-section">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={!!appliedPromo || isValidatingPromo}
          />
          {appliedPromo ? (
            <button
              type="button"
              onClick={() => {
                setAppliedPromo(null);
                setPromoCode('');
                setPromoMessage('');
              }}
              disabled={isValidatingPromo}
            >
              Remove Promo
            </button>
          ) : (
            <button
              type="button"
              onClick={applyPromoCode}
              disabled={isValidatingPromo || !promoCode.trim()}
            >
              {isValidatingPromo ? 'Applying...' : 'Apply Promo'}
            </button>
          )}
          {promoMessage && (
            <p className={`promo-message ${promoMessage.includes('success') ? 'success' : 'error'}`}>
              {promoMessage}
            </p>
          )}
        </div>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount().toFixed(2)}</p>
          </div>

          {appliedPromo && getDiscountAmount() > 0 && (
            <div className="cart-total-details">
              <p>Discount ({appliedPromo.code})</p>
              <p>-₹{getDiscountAmount().toFixed(2)}</p>
            </div>
          )}

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee().toFixed(2)}`}</p>
          </div>

          <hr />
          <div className="cart-total-details total">
            <b>Total</b>
            <b>₹{getFinalAmount().toFixed(2)}</b>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader small /> : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;