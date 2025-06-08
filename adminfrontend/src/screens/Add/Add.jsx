import React from 'react';
import { useState } from 'react';
import { assets } from '../../assets/assets';
import './Add.css';

const Add = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        category: 'Salad',
        price: ''
    })

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }
	const onSubmitHandler = (e) => {
		e.preventDefault();
		if (!image) {
			alert('Please upload an image');
			return;
		}
		if (!data.name || !data.description || !data.price) {
			alert('Please fill all fields');
			return;
		}
		const formData = new FormData();
		formData.append('image', image);
		formData.append('name', data.name);
		formData.append('description', data.description);
		formData.append('category', data.category);
		formData.append('price', data.price);

		console.log('Form submitted:', Object.fromEntries(formData));
	}

    return (
        <div className='screen'>
            <form onSubmit={onSubmitHandler} className='flex-col'>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product name</p>
                    <input value={data.name} onChange={onChangeHandler} type="text" name="name" placeholder='Type here' />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea value={data.description} onChange={onChangeHandler} name="description" rows="6" placeholder='Write content here' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product Category</p>
                        <select name="category" value={data.category} onChange={onChangeHandler}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input value={data.price} onChange={onChangeHandler} 
                        type="Number" name='price' placeholder='₹150' required />
                    </div>
                </div>

                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
}

export default Add;