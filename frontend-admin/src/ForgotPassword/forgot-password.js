import React, { useState } from "react";
import "./forgot-password.css";
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook.jpg';
import logo from '../assets/FactreeLogo.png';
import model from '../assets/Person.png';
import name from '../assets/Factree Writing.png';
import { useNavigate } from  "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setError('Your password has been successfully reset. You can log in now.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error during password reset:', err);
      setError('An error occurred while resetting the password.');
      setSuccess('');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 login-section">
          <div className="logo">
            <img src={logo} alt="Logo" />
            <img style={{ width: '110px', marginBottom: '10px' }} src={name} alt="logo" />
          </div>
          <h2>Reset Password</h2>
          <p style={{marginLeft:'40px'}}>Submit your Email ID and new password</p>

          <form>
            <div className="input-field">
              <i className="fa fa-user"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '350px' }}
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '350px' }}
              />
            </div>
            <div className="input-field">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '350px' }}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <div className="buttons">
              <button className="login-btn" onClick={handlePasswordReset} style={{ marginLeft: '100px' }}>
                Reset
              </button>
            </div>
          </form>

          <button className="google-btn">
            <a href="/socials-login">
              <img src={googleIcon} style={{ marginTop: '30px', marginLeft: '50px' }} alt="Google Icon" />
            </a>
            <a href="/socials-login">
              <img src={facebookIcon} style={{ marginTop: '30px', marginLeft: '50px' }} alt="Facebook Icon" />
            </a>
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

export default ForgotPassword;
