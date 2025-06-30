import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css';
import { StoreContext } from '../../context/StoreContext';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const { admin, setLoginPopup } = useContext(StoreContext); 

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setList(response.data.data);
    } catch (error) {
      toast.error('Failed to load food items');
    }
  };

  const removeFood = async (id) => {
    if (!admin) {
      toast.warn("Only admins can delete items.");
      setLoginPopup(true); 
      return;
    }

    try {
      await axios.delete(`${url}/api/food/remove?id=${id}`);
      fetchList();
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list flex-col'>
      <h1>All Foods List</h1>
      <div className='list-table'>
        <div className='list-table-format title'>
          <p><b>Image</b></p>
          <p><b>Name</b></p>
          <p><b>Category</b></p>
          <p><b>Price</b></p>
          <p><b>Action</b></p>
        </div>
        {list.map((item) => (
          <div key={item._id} className='list-table-format'>
            <img src={`${url}/uploads/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <button onClick={() => removeFood(item._id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
