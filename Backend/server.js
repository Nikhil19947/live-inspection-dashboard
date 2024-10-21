require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Import User model
const User = require('./models/User');

// Set up express
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection string from environment variables
const URI = process.env.MONGO_URI;

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const dbName = connection.connection.name;
    console.log(`Connected to database: ${dbName}`);

    // Fetch and print all users (only relevant fields: username and password)
    const users = await User.find({}, 'username password');  // Specify fields to return
    console.log('Users in the database:', users);  // Print users to the terminal
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  }
};

// Connect to MongoDB and print users
connectDB();

// POST: /login - Authenticate user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});