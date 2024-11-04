require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Set up express
const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root_pass813',
  database: 'factreeai' 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// Promisify MySQL Queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

app.post('/signup', async (req, res) => {
  const { username, password, first_name, last_name, phoneNumber, role, shift, reportingManager } = req.body;

  if (!username || !password || !first_name || !last_name || !phoneNumber || !role || !shift || !reportingManager) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const queryText = `
      INSERT INTO users (username, password, first_name, last_name, phone_number, role, shift, reporting_manager) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await query(queryText, [username, hashedPassword, first_name, last_name, phoneNumber, role, shift, reportingManager]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error inserting user:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Error signing up user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const queryText = 'SELECT * FROM users WHERE username = ?';
    const results = await query(queryText, [username]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in user' });
  }
}); 

app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const queryText = 'SELECT * FROM users WHERE username = ?';
    const results = await query(queryText, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';
    await query(updateQuery, [hashedPassword, email]);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
