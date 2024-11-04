import React from 'react';
import './NotFoundPage.css'; 

const NotReadyPage = () => {
  return (
    <div className="not-ready-container">
      <h1>This Page is Not Ready Yet</h1>
      <p>We're working hard to bring this page to you. Please check back later!</p>
      <button onClick={() => window.history.back()} className="back-button">
        Go Back
      </button>
    </div>
  );
};

export default NotReadyPage;
