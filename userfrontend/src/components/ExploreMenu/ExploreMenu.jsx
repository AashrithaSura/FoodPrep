import React from 'react';
import { menu_list } from '../../assets/assets';
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h2>Explore our menu</h2>
            <p className="explore-menu-text">
                Choose from a diverse menu featuring a delectable array of dishes.Our mission is to satisfy your cravings and elevate your dining experience, 
                one delicious meal at a time.
            </p>
            <div className="explore-menu-list">
                        {menu_list.map((item,index)=>{
                            return(
                                <div key={index} className='explore-menu-list-item' onClick={()=>setCategory(category =>category===item.menu_name?'All':item.menu_name)}>
                                    <img src={item.menu_image} className={category===item.menu_name?'active':''} alt="" />
                                    <p>{item.menu_name}</p>
                                </div>
                            )
                        })}
            </div>
            <hr />
        </div>
 )
}
            
export default ExploreMenu