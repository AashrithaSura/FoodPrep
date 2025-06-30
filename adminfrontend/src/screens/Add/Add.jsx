import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import './Add.css';

const Add = ({ url }) => {
  const { admin, setLoginPopup } = useContext(StoreContext); 

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    category: 'Salad',
    price: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!admin) {
      toast.warn("Only admins can add items.");
      setLoginPopup(true);
      return;
    }

    if (!image || !data.name || !data.description || !data.price) {
      toast.error("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price);

    try {
      await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Food item added successfully!');
      setData({ name: "", description: "", price: "", category: "Salad" });
      setImage(false);
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error(error.response?.data?.message || 'Failed to add food item');
    }
  };

  const restrictAccess = () => {
    if (!admin) {
      toast.info("Only admins can perform this action.");
      setLoginPopup(true);
    }
  };

  return (
    <div className='screen'>
      <form onSubmit={onSubmitHandler} className='flex-col'>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input
            onClick={restrictAccess}
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            value={data.name}
            onFocus={restrictAccess}
            onChange={onChangeHandler}
            type="text"
            name="name"
            placeholder='Type here'
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            value={data.description}
            onFocus={restrictAccess}
            onChange={onChangeHandler}
            name="description"
            rows="6"
            placeholder='Write content here'
            required
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              onFocus={restrictAccess}
              onChange={onChangeHandler}
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              value={data.price}
              onFocus={restrictAccess}
              onChange={onChangeHandler}
              type="number"
              name="price"
              placeholder="₹150"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">ADD</button>
      </form>
    </div>
  );
};

export default Add;
