import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import googleIcon from './assets/google-icon.png';
import facebookIcon from './assets/facebook.jpg';
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

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
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
      setError('Invalid email format. Please enter a valid email address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 login-section">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <img style={{width:'110px', marginBottom:'10px'}} src={name} alt="logo"/>
          </div>
          <h2>LOGIN</h2>
          <p style={{marginLeft:'50px'}}>Login to inspect smarter and spend lighter</p>

          <form>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{width:'350px'}}
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{width:'350px'}}
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
              <button className="login-btn" onClick={handleLoginClick} style={{marginLeft:'100px'}}>Login Now</button>
            </div>
          </form>

          <button className="google-btn">
            <a href="/socials-login"><img src={googleIcon} style={{marginTop:'30px', marginLeft:'50px'}} alt="Google Icon" /></a>
            <a href="/socials-login"><img src={facebookIcon} style={{marginTop:'30px', marginLeft:'50px'}} alt="Google Icon" /></a>
          </button>
        </div>

        <div className="col-md-6 welcome-section">
          <div className="text-image-container">
            <h2>Welcome to the most advanced deep tech engine!</h2>
            <img src={model} alt="Person" />
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
      </Routes>
    </Router>
  );
}

export default MainApp;
