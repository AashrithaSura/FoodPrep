// src/components/Logout/Logout.jsx
import { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
  const { setToken, setAdmin } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken('');
    setAdmin(false);
    toast.success("Logged out successfully");
    navigate('/');
  }, [setToken, setAdmin, navigate]);

  return null;
};

export default Logout;
