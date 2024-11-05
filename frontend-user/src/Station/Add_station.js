import React, { useState } from 'react';
import './Add_station.css';
import axios from 'axios';

const AddUserPage = () => {
    const [formData, setFormData] = useState({
        name : '',
        location : '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [image, setImage] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:5000/add_station', formData);

            if (response.status === 201) {
                setSuccessMessage('Station successfully added!');
                setFormData({
                    name : '',
                    location : '',
                });
                setImage(null);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Station addition failed.');
        }
    };

    return (
        <>
            <div 
                style={{
                    background: 'rgb(255, 255, 255)',
                    borderRadius: '10px', 
                    margin: '0 auto', 
                    padding: '20px', 
                    width: '80%', 
                    maxWidth: '1300px', 
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <div className="row h-100">
                    <div className="col-md-9"> 
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Station Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="name" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Location</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="location" 
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <button 
                                    className="btn btn-primary profile-button" 
                                    type="button"
                                    onClick={handleFormSubmit}
                                >
                                    Save Station
                                </button>
                            </div>
                            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                body {
                    background: rgb(99, 39, 120); /* Set the body background color */
                    margin: 0; /* Remove default body margin */
                    height: 100vh; /* Ensure the body takes full viewport height */
                    display: flex; /* Use flex to center content */
                    justify-content: center; /* Center horizontally */
                    align-items: center; /* Center vertically */
                }
            `}</style>
        </>
    );
};

export default AddUserPage;
