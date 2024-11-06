import React, { useState, useRef, useEffect } from 'react';
import './Dashboard.css';
import logo from '../assets/FactreeLogo.png';
import name from '../assets/Factree Writing.png'
import { v4 as uuidv4 } from 'uuid';

function LiveInspection() {
  const [cameraFeeds] = useState(Array(6).fill(null)); // Now 6 cameras
  const [isStreaming, setIsStreaming] = useState(false); // For controlling the webcam stream
  const videoRef = useRef(null);
  const streamRef = useRef(null); // To store the stream object for later stop
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [uniquePartId, setUniquePartId] = useState('');

  const thumbnailsRefs = useRef(Array(6).fill(null));

  const handleStart = async () => {
    const newUniquePartId = uuidv4();
    setUniquePartId(newUniquePartId); 
    
    try {
      const response = await fetch('http://localhost:5000/start_process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: newUniquePartId,
          part_name: selectedVariant,
        }),
      });
      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error("Error starting process: ", error);
    } finally {
      setIsLoading(false);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Assign the stream to the main video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Assign the stream to each thumbnail video
      thumbnailsRefs.current.forEach((ref) => {
        if (ref) {
          ref.srcObject = stream;
        }
      });

      streamRef.current = stream; // Store the stream so it can be stopped later
      setIsStreaming(true); // Set streaming to true when the video starts
    } catch (err) {
      console.error("Error accessing webcam: ", err);
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch('http://localhost:5000/stop_process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          part_id: uniquePartId,
        }),
      });
      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error("Error starting process: ", error);
    } finally {
      setIsLoading(false);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop()); // Stop all video tracks
      streamRef.current = null;
      setIsStreaming(false); // Set streaming to false when the video stops
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    if (isStreaming) {
      setIsLoading(true); // Show loading button
    }
  };

  const totalAccepted = Math.floor(Math.random() * 10000);
  const totalNonAccepted = Math.floor(Math.random() * 5000);
  const totalInspected = totalAccepted + totalNonAccepted;

  const [defects, setDefects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [analytics, setAnalytics] = useState([]);

//   const fetchDefects = async () => {
//     try {
//         const response = await fetch('http://localhost:5000/api/defects');
//         if (!response.ok) throw new Error("Failed to fetch defects");
//         const data = await response.json();
//         setDefects(data);
//     } catch (error) {
//         console.error("Error fetching defects: ", error);
//     }
// };


//   const fetchInspections = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/inspections');
//       const data = await response.json();
//       setInspections(data);
//     } catch (error) {
//       console.error("Error fetching inspections: ", error);
//     }
//   };

//   const fetchAnalytics = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/analytics');
//       const data = await response.json();
//       setAnalytics(data);
//     } catch (error) {
//       console.error("Error fetching analytics: ", error);
//     }
//   };

//   useEffect(() => {
//     fetchDefects();
//     fetchInspections();
//     fetchAnalytics();
//   }, []);

  return (
    <div className="live-inspection-page">
      {/* Live Inspection Header */}
      <header className="inspection-header">
        <div className="factree-logo">
          <img src={logo} alt="Factree Logo" />
          <img src={name} alt="Factree" />
        </div>
        <h1 className="live-inspection-title">Live Inspection</h1>
      </header>
      {/* Top bar for selection and controls */}
      <div className="top-bar">
        <div className="factree-section">
          {/* Moved Variant and Station Selectors below the logo */}
          <div className="selectors-buttons">
            <div className="selectors">
              <select>
                <option>Select Station</option>
                <option>Station 1</option>
                <option>Station 2</option>
              </select>
              <select onChange={(e) => setSelectedVariant(e.target.value)}>
                <option>Select Variant</option>
                <option>Variant 1</option>
                <option>Variant 2</option>
              </select>
            </div>
            {/* Controls buttons */}
            <div className="controls-buttons">
              <button type="button" className="btn btn-primary" onClick={handleStart} disabled={isStreaming}>START</button>
              <button type="button" className="btn btn-primary" onClick={handleCheck}>INSPECT</button>
              <button type="button" className="btn btn-danger" onClick={handleStop}>STOP</button>
            </div>
          </div>
        </div>
        {/* Loading Button below the Title */}
        <div className="loading-buttons">
          {isLoading ? (
            <button className="btn btn-primary" type="button" disabled={!isLoading}>
              <>
                <span className="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
                <span role="status">&nbsp;&nbsp;Inspecting...</span>
              </>
            </button>
          ) : (
            ''
          )}
        </div>
        {/* Inspector, Batch ID, Camera Health, PLC Health */}
        <div className="controls-section">
          {/* Inspector and Batch ID in one box */}
          <div className="status-info">
            <div className="status-item">
              <label>Inspector  &nbsp;&nbsp;:&nbsp;&nbsp;</label>
              <span> Inspector 1</span>
            </div>
            <div className="status-item">
              <label>Batch ID   &nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;</label>
              <span> Batch 1</span>
            </div>
          </div>

          {/* Health statuses in another box */}
          <div className="health-statuses">
            <div className="health-status1">
              <div className="health-status-label">Camera Health&nbsp;&nbsp;:</div>
              <div className="status-circle1"></div>
            </div>
            <div className="health-status2">
              <div className="health-status-label">PLC Health&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :</div>
              <div className="status-circle2"></div>
            </div>
          </div>
        </div>


      </div>

      {/* Main inspection area */}
      <div className="main-inspection-area">
        {/* Camera and defect section */}
        <div className="camera-feed">
          <strong><span>LIVE</span></strong>
          <div className="camera-header">
            <video ref={videoRef} autoPlay muted style={{ width: '700px', height: '450px' }} />
          </div>
          {/* <div className="camera-display">
            <img src={cameraFeeds[0] || '/path/to/placeholder.png'}/>
          </div> */}
        </div>

        <div className="camera-thumbnails">
          {cameraFeeds.map((feed, index) => (
            <div key={index} className="camera-thumbnail">
              <video ref={el => (thumbnailsRefs.current[index] = el)} autoPlay muted style={{ width: '131px', marginTop: '10px' }} />
              <span>Camera {index + 1}</span>
            </div>
          ))}
        </div>
        {/* Defect classification, metrology, and summary section */}
        <div className="side-panel">
          {/* Defect classification table */}
          {/* Defect classification table */}
          <div className="defect-classification">
            <h2 style={{ marginTop: '15px' }}>Defect Classification</h2>
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
                  {defects.map((defect, i) => (
                    <tr key={i}>
                      <td>{defect.defect_type}</td>
                      <td>{defect.count}</td>
                      <td>{defect.percentage}%</td>
                    </tr>
                  ))}
                  {/* Add empty rows if less than 3 defects */}
                  {defects.length < 3 &&
                    Array.from({ length: 3 - defects.length }).map((_, i) => (
                      <tr key={`empty-${i}`}>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Metrology table */}
          <div className="metrology">
            <h2 style={{ marginTop: '5px' }}>Metrology</h2>
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

          {/* Summary section */}
          <div className="summary">
            <h2 style={{ marginTop: '5px' }}>Summary</h2>
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
                  <tr>
                    <td>Total Accepted</td>
                    <td>{totalAccepted}</td>
                    <td>{((totalAccepted / (totalAccepted + totalNonAccepted)) * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Total Non Accepted</td>
                    <td>{totalNonAccepted}</td>
                    <td>{((totalNonAccepted / (totalAccepted + totalNonAccepted)) * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td>Total Inspected</td>
                    <td>{totalInspected}</td>
                    <td>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      <div className="bottom-section">
        <div className="bottom-box-wrapper">
          <div className="bottom-box">
            <p>INSPECTION IN PROGRESS</p>
          </div>
          <div className="bottom-box-new">
            <p style={{fontSize:'15px', marginTop:'12px'}}>ACCEPTED/REJECTED</p>
          </div>
        </div>
        <div className="additional-box">
          <strong><p className="additional-text">OCR</p></strong>
          <p className="additional-text">Batch&nbsp;&nbsp;&nbsp;-</p>
          <p className="additional-text">Exp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-</p>
        </div>
      </div>

    </div>
  );
}

export default LiveInspection;
