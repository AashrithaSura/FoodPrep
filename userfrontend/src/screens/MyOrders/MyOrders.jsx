import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import './MyOrders.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import StarRating from '../../components/StarRating/StarRating';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [canceling, setCanceling] = useState(false);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${url}/api/order/userorders`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load orders. Please try again.');
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const cancelOrder = async () => {
    if (!orderToCancel) return;
    
    setCanceling(true);
    try {
      await axios.patch(`${url}/api/order/cancel/${orderToCancel}`, {}, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCanceling(false);
      setShowCancelModal(false);
      setOrderToCancel(null);
    }
  };

  const submitRating = async (orderId, itemId, rating) => {
    try {
      await axios.post(`${url}/api/order/rate`, {
        orderId,
        itemId,
        rating
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Thank you for your rating!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setError("Please login to view orders");
      setIsLoading(false);
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'shipped': return '#2196F3';
      case 'processing': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading || canceling) return <Loader />;

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <h2>My Orders</h2>
        <button onClick={fetchOrders} className="refresh-btn">Refresh</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="container">
        {data.length > 0 ? (
          data.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order._id?.substring(0, 8)}</div>
                <div className="order-date">
                  <div><b>Ordered:</b> {formatDate(order.createdAt)}</div>
                  <div><b>Updated:</b> {formatDate(order.updatedAt)}</div>
                </div>
              </div>

              <div className="order-body">
                <div className="order-icon">
                  <img src={assets.parcel_icon} alt="Order" />
                </div>

                <div className="order-details">
                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item-rating">
                        <span>{item.name} × {item.quantity}</span>
                        <StarRating
                          rating={item.rating || 0}
                          onRate={(value) => submitRating(order._id, item._id, value)}
                          readOnly={order.status.toLowerCase() !== 'delivered'}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="order-meta">
                    <div className="order-amount">₹{order.amount.toFixed(2)}</div>
                    <div className="order-item-count">{order.items.length} item(s)</div>
                    <div className="order-status">
                      <span 
                        className="status-dot" 
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      ></span>
                      <b>{order.status}</b>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-footer">
                {!['delivered', 'cancelled'].includes(order.status.toLowerCase()) && (
                  <button 
                    className="cancel-btn" 
                    onClick={() => confirmCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <p>No orders found</p>
            <p>Your paid order history will appear here</p>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h4>Cancel Order</h4>
            <p>Are you sure you want to cancel this order?</p>
            <div className="modal-actions">
              <button className="confirm" onClick={cancelOrder}>Yes</button>
              <button className="reject" onClick={() => setShowCancelModal(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

