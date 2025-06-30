import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    birthdate: '',
    gender: '',
    address: '',
    joinedDate: new Date().toLocaleDateString(),
    profileImage: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userProfile'));
    if (stored) {
      setUser(prev => ({
        ...prev,
        ...stored,
        joinedDate: stored.joinedDate || new Date().toLocaleDateString()
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      if (!files || !files[0]) return;
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUser = { ...user, profileImage: reader.result };
        setUser(updatedUser);
        localStorage.setItem('userProfile', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(files[0]);
    } else {
      const updatedUser = { ...user, [name]: value };
      setUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    const updatedUser = { ...user, birthdate: formattedDate };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userProfile', JSON.stringify(user));
    toast.success('Profile updated successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Calculate max date for birthdate (18 years ago)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() - 18);
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p className="welcome-message">Update your personal information</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="profile-card">
          <div className="avatar-section">
            <img
              src={user.profileImage || '/profile-default.png'}
              alt="Profile"
              className="profile-avatar"
            />
            <label className="upload-btn">
              Change Photo
              <input 
                type="file" 
                name="profileImage" 
                accept="image/*" 
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          <div className="profile-details">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthdate">Birthdate</label>
                <input
                  id="birthdate"
                  type="date"
                  name="birthdate"
                  value={user.birthdate}
                  onChange={handleDateChange}
                  max={maxDate.toISOString().split('T')[0]}
                  min={minDate.toISOString().split('T')[0]}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleChange}
                  placeholder="30"
                  min="18"
                  max="100"
                  readOnly={!!user.birthdate} // Auto-calculate if birthdate exists
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={user.address}
                onChange={handleChange}
                placeholder="123 Main St, City, Country"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;