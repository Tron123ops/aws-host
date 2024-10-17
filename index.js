// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from env or default to 5000

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // Use environment variable
  user: process.env.DB_USER,      // Use environment variable
  password: process.env.DB_PASSWORD, // Use environment variable
  database: process.env.DB_NAME    // Use environment variable
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
});

// Routes
app.post('/api/friends', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'INSERT INTO friends (name, email, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, email, phone], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error adding friend' });
    }
    res.status(201).json({ id: results.insertId, name, email, phone });
  });
});

app.get('/api/friends', (req, res) => {
  const sql = 'SELECT * FROM friends';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error retrieving friends' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
