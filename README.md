# 🍔 Food Prep App

## Overview

This is a full-stack Food Ordering and Management system that allows users to browse food items, place orders, and rate dishes, while admins manage menu items and orders. It includes authentication, role-based access, payments, and cloud image storage.

## Features

* User authentication (JWT-based login & signup)
* Role-based access (User / Admin)
* Browse food menu with images and details
* Add/remove items from cart
* Place orders and view order history
* Food rating system (user + admin ratings)
* Admin dashboard to manage food items & orders
* Profile management with image upload
* Notifications & promo system
* Stripe payment integration
* Mobile-friendly responsive UI

## Tech Stack

* React.js (Frontend)
* Node.js (Backend)
* Express.js
* MongoDB (Database)
* JWT Authentication
* Cloudinary (Image storage)
* Stripe (Payments)
* Axios
* React Toastify


## Environment Variables

DB_URI=your_mongodb_connection_string
JWT_TOKEN_SECRET=your_jwt_secret
JWT_EXPIRES_IN=2d

STRIPE_SECRET_KEY=your_stripe_secret_key

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret


## Working Flow

1. User registers/login
2. Browse food items
3. Add to cart
4. Place order via Stripe
5. Order confirmation
6. Rate food items
7. Admin manages system

## Future Improvements

* AI food recommendations
* Live order tracking
* Chat support
* Admin analytics dashboard
* Delivery integration

