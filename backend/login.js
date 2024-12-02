require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // If you need cookies or authentication headers
}));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));



// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dummydb' 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

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

// Signup route
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

// Login route
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

// Reset password route
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

// Add product route
app.post('/add_part', async (req, res) => {
  const { name, type, batch } = req.body;

  if (!name || !type || !batch) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const product_id = uuidv4();
  const is_deleted = false;

  try {
    const queryText = `
      INSERT INTO products (product_id, product_name, product_type, product_batch, is_deleted) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await query(queryText, [product_id, name, type, batch, is_deleted]);

    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

app.post('/add_station', async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const station_id = uuidv4();
  const is_deleted = false;

  try {
    const queryText = `
      INSERT INTO station (station_id, station_name, location, is_deleted) 
      VALUES (?, ?, ?, ?)
    `;
    await query(queryText, [station_id, name, location, is_deleted]);

    res.status(201).json({ message: 'Station added successfully' });
  } catch (err) {
    console.error('Error inserting station:', err);
    res.status(500).json({ message: 'Error adding station' });
  }
});



// Route for parts
app.get('/api/parts', async (req, res) => {
  try {
      const [parts] = await db.query('SELECT * FROM products WHERE is_deleted = 0');
      res.json(parts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching parts data' });
  }
});

app.delete('/api/parts/:id', (req, res) => {
  const partId = req.params.id;    
  const sql = 'UPDATE products SET is_deleted = 1 WHERE product_id = ?';
  
  db.query(sql, [partId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to delete part' });
      }
      return res.status(200).json({ message: 'Part deleted successfully' });
  });
});

app.get('/api/station', async (req, res) => {
  try {
      const [parts] = await db.query('SELECT * FROM station WHERE is_deleted = 0');
      res.json(parts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching station data' });
  }
});

app.delete('/api/station/:id', (req, res) => {
  const stationId = req.params.id;    
  const sql = 'UPDATE station SET is_deleted = 1 WHERE station_id = ?';
  
  db.query(sql, [stationId], (err, result) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to delete station' });
      }
      return res.status(200).json({ message: 'Station deleted successfully' });
  });
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
