import { useContext, useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Orders.css';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, setLoginPopup } = useContext(StoreContext); 

  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.get(url + "/api/order/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    if (!admin) {
      toast.warn("Only admins can update order status");
      setLoginPopup(true);
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        url + "/api/order/update-status",
        { orderId, status: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchAllOrders();
      toast.success("Order status updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return <div className="screen order">Loading orders...</div>;
  }

  return (
    <div className="screen order">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No paid orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="parcel icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, itemIndex) => {
                    const isLast = itemIndex === order.items.length - 1;
                    return item.name + " x " + item.quantity + (isLast ? "" : ", ");
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.first_name + " " + order.address.last_name}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city + ", " +
                      order.address.state + ", " + // 👈 Fixed: was showing street twice
                      order.address.country + ", " +
                      order.address.zip_code}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
              <select
                onChange={(e) => statusHandler(e, order._id)}
                value={order.status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;