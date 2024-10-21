import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"; 
import "./App.css";
import googleIcon from './assets/google-icon.png'; 
import logo from './assets/FactreeLogo.png';
import model from './assets/Person.png';
import DashboardPage from "./Dashboard.js"; 

function App() {
  const navigate = useNavigate(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');  // Navigate to the dashboard
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="container">
      <div className="login-section">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <h1>factree</h1>
        </div>
        <h2>LOGIN</h2>
        <p>Login to inspect smarter and spend lighter</p>

        <form>
          <div className="input-field">
            <i className="fa fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="input-field">
            <i className="fa fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <p className="forgot-password">Forgot Password?</p>

          {error && (
            <div style={{
              color: '#ff4545',
              backgroundColor: '#ffebeb',
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              marginLeft: '60px',
              borderRadius: '5px',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}

          <div className="buttons">
            <button className="login-btn" onClick={handleLoginClick}>Login Now</button>
            <button className="signup-btn">SignUp</button>
          </div>
        </form>

        <div className="divider">
          <p>Login with Others</p>
        </div>
        
        <button className="google-btn">
          <img src={googleIcon} alt="Google Icon" /> Login with Google
        </button>
      </div>

      <div className="welcome-section">
        <div className="text-image-container">
          <h2>Welcome to the most advanced deep tech engine!</h2>
          <img src={model} alt="Person" />
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
      </Routes>
    </Router>
  );
}

export default MainApp;