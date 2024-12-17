import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
//Social icon logo paths
import googleIcon from './assets/google-icon.png';
import instagramIcon from './assets/instagram.png'
import facebookIcon from './assets/facebook.jpg';
import linkedinIcon from './assets/linkedin.png';
import twitterIcon from './assets/twitter.png'
import logo from './assets/FactreeLogo.png';

import model from './assets/Person.png';
import DashboardPage from "./Dashboard/Dashboard.js";
import ReportsPage from "./Reports/Reports.js";
import NotFoundPgae from "./NotFoundPage/NotFoundPage.js";
import DetailedViewPage from './Detailed_View/Detailed_View.js';
import ForgotPasswordPage from './ForgotPassword/forgot-password.js';
import name from './assets/Factree Writing.png';
import AdminPage from './Admin/Admin.js'
import AddUserPage from './Admin/Add_user.js'
import PartManagementPage from './Part_management/Part_management.js';
import AddPartPage from './Part_management/Add_part.js'
import StationPage from './Station/Station.js';
import AddStationPage from './Station/Add_station.js';

import { ShareSocial } from 'react-share-social'; // Ensure this import is present

import './LoginPage.css'
import { AiFillInstagram } from "react-icons/ai";

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  
  
  // Update the email validation regex to only allow @factree.ai domain name
  const emailRegex = /^[a-zA-Z0-9._%+-]+@factree\.ai$/; 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Add console.log to debug
    console.log('Email:', email);
    console.log('Is valid:', emailRegex.test(email));

    if (!emailRegex.test(email)) {
      setError('Please use your @factree.ai email address to login.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        setLoginAttempts(0); // Reset attempts on successful login
        navigate('/dashboard');
      } else {
        // Increment failed attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setShowLockoutModal(true);
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred while logging in.');
    }
  };

  const handleSignupClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please use your @factree.ai email address to sign up.');
      return;
    
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setError('Signup successful! You can now log in.');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError('An error occurred while signing up.');
    }
  };

  // Add Modal component
  const LockoutModal = () => (
    <div className="modal" style={{
      display: showLockoutModal ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        maxWidth: '400px'
      }}>
        <h3>Account Locked</h3>
        <p>You have exceeded the maximum number of login attempts.</p>
        <p>Please contact admin at admin@factree.ai to reset your password.</p>
        <button 
          onClick={() => {
            setShowLockoutModal(false);
            setLoginAttempts(0);
            setPassword('');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid" >
      <LockoutModal />
      <div className="row">
        <div className="col-md-6 login-section"style={{marginTop:'-100px'}}>
          <div className="logo" style={{
            position: 'absolute',
            top: '15px',
            left: '15px'
          }}>
            <img src={logo} alt="Logo" style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              height: '49px',
              width: 'auto',
              marginTop:'10px'
            }}/>
            <img src={name} alt="logo" style={{
              display: 'flex',
              verticalAlign: 'middle',
              width: '110px',
              marginLeft: '5px'
            }}/>
          </div>
          <h1 style={{ marginTop: '120px' }}>LOGIN</h1>

          <p style={{marginLeft:'50px'}}>Login to inspect smarter and spend lighter</p>

          <form>
            <div className="input-field">
              <i className="fa fa-user" style={{ 
                fontWeight: 'bold',
                fontSize: '20px',
                marginRight: '10px',
                color: '#333'
              }}></i>
              <input
                type="email"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{width:'350px'}}
                className="bold-placeholder"
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock" style={{ 
                fontWeight: 'bold',
                fontSize: '20px',
                marginRight: '10px',
                color: '#333'
              }}></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{width:'350px'}}
                className="bold-placeholder"
              />
            </div>
            <p className="forgot-password">
              <a href="/forgot-password" style={{fontSize:'15px'}}>Forgot Password?</a> 
            </p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="buttons">
              <button className="login-btn" onClick={handleLoginClick} style={{marginLeft:'80px', width:'150px', height:'60px', borderRadius:'10px'}}>Login Now</button>
            </div>
          </form>
          <button className="google-btn">
            <a href="/socials-login">
              <img 
                src={googleIcon} 
                style={{ marginTop: '20px', marginLeft: '20px', display: 'inline-block' }} 
                alt="Google Icon" 
              /></a>
          <p style={{ display: 'flex', position:'relative', marginLeft: '12px', marginTop: '32px', fontWeight: 'bold' }}>
            Login with&nbsp;<b>Google</b>
          </p>
          </button>
          {/* <p> View our official web page</p> */}
          <div className="social-icons-button" style={{ marginTop: '20px', marginLeft: '20px', display: 'flex', gap:'10px' }}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} style={{ width: '30px', height: '30px', marginRight: '10px' }} alt="Facebook" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} style={{ width: '30px', height: '30px', marginRight: '10px' }} alt="Instagram" />
            </a>
            <a href="https://www.linkedin.com/company/factree.ai/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} style={{ width: '30px', height: '30px', marginRight: '10px' }} alt="LinkedIn" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} style={{ width: '30px', height: '30px', marginRight: '10px' }} alt="Twitter" />
            </a>
          </div>
        </div>

        <div className="col-md-6 welcome-section" style={{marginTop:'-88px'}}>
          <div className="text-image-container">
            <h2 style={{height:'80px', marginTop:'200px'}}>Welcome to the most advanced deep tech engine!</h2>
            <img src={model} alt="Person"/>
          </div>  
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/detailed_view" element={<DetailedViewPage/>}/>
        <Route path="/socials-login" element={<NotFoundPgae/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="/add_user" element={<AddUserPage/>}/>
        <Route path="/parts" element={<PartManagementPage/>}/>
        <Route path="/add_part" element={<AddPartPage/>}/>
        <Route path="/station" element={<StationPage/>}/>
        <Route path="/add_station" element={<AddStationPage/>}/>
      </Routes>
    </Router>
  );
}

export default MainApp;
