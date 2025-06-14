import './LoginPopup.css';
import React, { useState } from 'react';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Signin");
    
    return (
        <div className="login-popup">
            <form className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState !== "Signin" ? <input type="text" placeholder="Your name" required /> : <></>}
                    <input type="email" placeholder="Your email" required />
                    <input type="password" placeholder="Password" required />
                </div>
                <button className="btn">
                    {currState}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {
                    currState === "Signin" ?<p>Create a new account?{" "}
                    <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                    :<p>Already have an account?{" "}
                    <span onClick={() => setCurrState("Login")}>Login here</span>
                    </p>
                }
            </form>
        </div>
    );
};

export default LoginPopup;