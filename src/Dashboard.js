import React, { useState } from 'react';
import './Dashboard.css';
import logo from './assets/FactreeLogo.png';

function LiveInspection() {
  const [cameraFeeds, setCameraFeeds] = useState(Array(6).fill(null)); // Now 6 cameras

  // Function to simulate camera feed when an image is detected
  const handleCameraFeed = (index) => {
    const newFeeds = [...cameraFeeds];
    newFeeds[index] = `/path/to/camera${index + 1}.png`; // Replace with actual image source
    setCameraFeeds(newFeeds);
  };

  return (
    <div className="live-inspection-page">
      {/* Live Inspection Header */}
      <header className="inspection-header">
        Live Inspection
      </header>

      {/* Top bar for selection and controls */}
      <div className="top-bar">
        <div className="factree-section">
          <div className="factree-logo">
            <img src={logo} alt="Factree Logo" />
            <span className="fname">factree</span>
          </div>

          {/* Variant and Station Selectors with Buttons */}
          <div className="selectors-buttons">
            <div className="selectors">
              <select>
                <option>Select Station</option>
                <option>Station 1</option>
                <option>Station 2</option>
              </select>
              <select>
                <option>Select Variant</option>
                <option>Variant 1</option>
                <option>Variant 2</option>
              </select>
            </div>

            {/* Controls buttons */}
            <div className="controls-buttons">
              <button className="start-btn">START</button>
              <button className="check-btn">CHECK</button>
              <button className="stop-btn">STOP</button>
            </div>
          </div>
        </div>

        {/* Inspector, Batch ID, Camera Health, PLC Health */}
        <div className="controls-section">
          <div className="status-health">
            {/* Inspector & Camera Health */}
            <div className="status-item">
              <select>
                <option>Inspector</option>
                <option>Inspector 1</option>
              </select>
              <div className="health-status">
                Camera Health:
                <div className="status-circle"></div>
              </div>
            </div>

            {/* Batch ID & PLC Health */}
            <div className="status-item">
              <select>
                <option>Batch ID</option>
                <option>Batch 1</option>
              </select>
              <div className="health-status">
                PLC Health:
                <div className="status-circle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main inspection area */}
      <div className="main-inspection-area">
        <div className="camera-feed">
          <div className="camera-header">
            <span>LIVE</span>
          </div>
          <div className="camera-display">
            <img src={cameraFeeds[0] || '/path/to/placeholder.png'} alt="Camera Feed" />
          </div>
        </div>

        {/* Camera Feed Thumbnails */}
        <div className="camera-thumbnails">
          {cameraFeeds.map((feed, index) => (
            <div
              key={index}
              className="camera-thumbnail"
              onClick={() => handleCameraFeed(index)}
            >
              <img
                src={feed || '/path/to/placeholder.png'} // Placeholder if no image is detected yet
                alt={`Camera ${index + 1}`}
              />
              <span>Camera {index + 1}</span>
            </div>
          ))}
        </div>

        {/* Defect Classification and Summary */}
        <div className="side-panel">
          <div className="defect-classification">
            <h3>Defect Classification</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Defect</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add more rows to demonstrate scrolling */}
                  {[...Array(20)].map((_, i) => (
                    <tr key={i}>
                      <td>Defect {i + 1}</td>
                      <td>{Math.floor(Math.random() * 100)}</td>
                      <td>{(Math.random() * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="metrology">
            <h3>Metrology</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Measured</th>
                    <th>Specification</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add more rows to demonstrate scrolling */}
                  {[...Array(20)].map((_, i) => (
                    <tr key={i}>
                      <td>Parameter {i + 1}</td>
                      <td>{(Math.random() * 100).toFixed(2)} mm</td>
                      <td>50.00 ±2</td>
                      <td className={Math.random() > 0.5 ? 'pass' : 'error'}>
                        {Math.random() > 0.5 ? '✔' : '✖'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="summary">
            <h3>Summary</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Total Inspected</th>
                    <th>Total Accepted</th>
                    <th>Total Not Accepted</th>
                    <th>Acceptance Rate</th>
                    <th>Rejection Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add more rows to demonstrate scrolling */}
                  {[...Array(20)].map((_, i) => (
                    <tr key={i}>
                      <td>{(Math.random() * 10000).toFixed(0)}</td>
                      <td>{(Math.random() * 10000).toFixed(0)}</td>
                      <td>{(Math.random() * 1000).toFixed(0)}</td>
                      <td>{(Math.random() * 100).toFixed(2)}%</td>
                      <td>{(Math.random() * 10).toFixed(2)}%</td>
                    </tr>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-box">
        <p>STATUS CHECKING</p>
      </div>
    </div>
  );
}
export default LiveInspection;