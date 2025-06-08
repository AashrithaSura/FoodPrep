import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email)) newErrors.email = 'Email is invalid';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!customerInfo.street.trim()) newErrors.street = 'Street address is required';
    if (!customerInfo.city.trim()) newErrors.city = 'City is required';
    if (!customerInfo.state.trim()) newErrors.state = 'State is required';
    if (!customerInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Process order submission here
      console.log('Order submitted:', { 
        customerInfo, 
        orderItems: cartItems,
        total: getTotalCartAmount()
      });
      navigate('/order-confirmation');
    }
  };

  const totalAmount = getTotalCartAmount();
  const deliveryFee = totalAmount > 0 ? 2 : 0;
  const finalTotal = totalAmount + deliveryFee;

  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2>Delivery Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="multi-fields">
            <div className="form-group">
              <label>First Name*</label>
              <input 
                type="text" 
                name="firstName"
                value={customerInfo.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className={errors.firstName ? 'error-input' : ''}
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Last Name*</label>
              <input 
                type="text" 
                name="lastName"
                value={customerInfo.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className={errors.lastName ? 'error-input' : ''}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>
          </div>

          <div className="multi-fields">
            <div className="form-group">
              <label>Email*</label>
              <input 
                type="email" 
                name="email"
                value={customerInfo.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone*</label>
              <input 
                type="tel" 
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={errors.phone ? 'error-input' : ''}
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Street Address*</label>
            <input 
              type="text" 
              name="street"
              value={customerInfo.street}
              onChange={handleChange}
              placeholder="Enter street address"
              className={errors.street ? 'error-input' : ''}
            />
            {errors.street && <span className="error">{errors.street}</span>}
          </div>

          <div className="multi-fields">
            <div className="form-group">
              <label>City*</label>
              <input 
                type="text" 
                name="city"
                value={customerInfo.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={errors.city ? 'error-input' : ''}
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State*</label>
              <input 
                type="text" 
                name="state"
                value={customerInfo.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? 'error-input' : ''}
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label>ZIP Code*</label>
              <input 
                type="text" 
                name="zipCode"
                value={customerInfo.zipCode}
                onChange={handleChange}
                placeholder="Enter ZIP code"
                className={errors.zipCode ? 'error-input' : ''}
              />
              {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method*</label>
            <div className="payment-options">
              <label className={customerInfo.paymentMethod === 'cash' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="paymentMethod"
                  value="cash"
                  checked={customerInfo.paymentMethod === 'cash'}
                  onChange={handleChange}
                />
                Cash on Delivery
              </label>
              <label className={customerInfo.paymentMethod === 'card' ? 'active' : ''}>
                <input 
                  type="radio" 
                  name="paymentMethod"
                  value="card"
                  checked={customerInfo.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                Credit/Debit Card
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="place-order-right">
        <div className="order-summary-container">
          <h2>Your Order</h2>
          <div className="order-summary">
            {food_list.map((food) => {
              if (cartItems[food._id] > 0) {
                return (
                  <div key={food._id} className="order-item">
                    <div className="order-item-img">
                      <img src={food.image} alt={food.name} />
                      <p>{cartItems[food._id]}x</p>
                    </div>
                    <p className="order-item-name">{food.name}</p>
                    <p className="order-item-price">${(food.price * cartItems[food._id]).toFixed(2)}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <p>Subtotal</p>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <div className="total-row">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="total-row grand-total">
              <p>Total</p>
              <p>${finalTotal.toFixed(2)}</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="place-order-btn" 
            onClick={handleSubmit}
            disabled={totalAmount === 0}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;