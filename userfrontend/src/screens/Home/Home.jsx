import { useState } from 'react';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './Home.css';
import ImageSlider from '../../components/ImageSlider/ImageSlider';

const Home = () => {
  const [category, setCategory] = useState('All');

  const sliderImages = [
    {
      url: '/header_img.png' ,

    },
    {
      url: '/Del_Menu.png',
      title: ' Too tasty to share 😋',
      description: 'But we won’t tell 🤫'
    },
    {
      url: '/Burger.png',
      title: 'Deal That Sizzles!',
      description: 'Our burgers are hot, the price is hotter 🔥 Save 50%!'
    },
    {
      url: '/New_Arrival.png',
      title: 'New Arrivals',
      description: 'Try our new seasonal menu'
    }, 
    {
    url: '/Macaron.png',
    title: 'Coming Soon!',
    description: 'Delicate French macarons are almost here ✨'
    },
    
  ];

  return (
    <div className="home-container">
      <ImageSlider slides={sliderImages} />

      <div className="home-sections">
        <ExploreMenu category={category} setCategory={setCategory} />
        <div id="food-display"></div>
        <FoodDisplay category={category} />
      </div>
    </div>
  );
};

export default Home;
