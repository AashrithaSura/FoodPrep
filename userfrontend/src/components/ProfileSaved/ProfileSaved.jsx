import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileSaved.css';

const ProfileSaved = () => {
  // Retrieve saved profile data from localStorage
  const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};

  return (
    <div className="profile-saved-container">
      <div className="profile-header">
        <h2>Profile Updated Successfully!</h2>
        <p className="success-message">Your changes have been saved.</p>
      </div>

      <div className="profile-view">
        <div className="profile-card">
          <div className="avatar-section">
            <img
              src={userProfile.profileImage || '/profile-default.png'}
              alt="Profile"
              className="profile-avatar"
            />
          </div>

          <div className="profile-details">
            <h3>Personal Information</h3>
            
            <div className="detail-row">
              <span className="detail-label">Full Name:</span>
              <span className="detail-value">{userProfile.name || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{userProfile.email || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{userProfile.phone || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{userProfile.gender || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Birthdate:</span>
              <span className="detail-value">{userProfile.birthdate || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{userProfile.age || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{userProfile.address || 'Not specified'}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">{userProfile.joinedDate || new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/profile" className="edit-btn">Edit Profile</Link>
          <Link to="/" className="home-btn">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileSaved;