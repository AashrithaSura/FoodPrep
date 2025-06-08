import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar/navbar';
import Cart from './screens/Cart/Cart';
import Home from './screens/Home/Home';
import PlaceOrder from './screens/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import StoreContextProvider from './context/StoreContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  
  return (
    <StoreContextProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
        </Routes>
        <Footer />
      </div>
    </StoreContextProvider>
  );
};

export default App;