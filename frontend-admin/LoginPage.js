import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', {
        username,
        password,
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token); 
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/signup', {
        username,
        password,
      });
      console.log('Signup successful:', response.data);
    } catch (error) {
      console.error('Signup failed:', error.response.data);
    }
  };

  return (
    <div className="login-container">
      <form>
        <div className="input-field">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="buttons">
          <button type="button" onClick={handleLogin}>Login Now</button>
          <button type="button" onClick={handleSignup}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
