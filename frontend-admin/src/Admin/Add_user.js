import React, { useState } from 'react';
import './Add_user.css';
import axios from 'axios';

const AddUserPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        phoneNumber: '',
        role: '',
        shift: '',
        reportingManager: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [image, setImage] = useState(null);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@factree\.ai$/;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        setErrorMessage('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!emailRegex.test(formData.username)) {
            setErrorMessage('Please use a valid @factree.ai email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/signup', formData, {
                mode: 'no-cors'
            });

            if (response.status === 201) {
                setSuccessMessage('User successfully registered!');
                setFormData({
                    username: '',
                    password: '',
                    first_name: '',
                    last_name: '',
                    phoneNumber: '',
                    role: '',
                    shift: '',
                    reportingManager: ''
                });
                setImage(null);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Signup failed.');
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
                    <div className="col-md-3 border-right">
                        <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} 
                                id="fileInput"
                            />
                            <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                <img 
                                    className="rounded-circle mt-5" 
                                    width="150px" 
                                    src={image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_BzGCRFUnQvDPPd8rrI9cHczEpj4ED5avR1pnKjAxkZ3yq_yoCrdXalvDvjLLEaaEMH0&usqp=CAU"} 
                                    alt="Profile"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="col-md-9"> 
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="first name" 
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Surname</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="surname" 
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Email ID</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="email id (@factree.ai)" 
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                    />
                                    {formData.username && !emailRegex.test(formData.username) && (
                                        <div className="text-danger mt-1">
                                            Please use a valid @factree.ai email address
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="phone number" 
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Role</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            style={{
                                                appearance: 'none',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'none',
                                                paddingRight: '30px',
                                                backgroundImage: 'url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M6%2010L1%205h10L6%2010z%22%20fill%3D%22%23666%22%2F%3E%3C%2Fsvg%3E")',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 10px center',
                                                backgroundSize: '12px 12px',
                                            }}
                                            className="form-control"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Super Admin">Super Admin</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Operator">Operator</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="labelsgit">Shift</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="shift" 
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Reporting Manager</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="reporting manager" 
                                        name="reportingManager"
                                        value={formData.reportingManager}
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
                                    Save Profile
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
