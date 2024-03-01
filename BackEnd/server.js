const express = require('express');
const pool = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors()); // Enable CORS for all routes

// Create customers table if it doesn't exist
async function createTable() {
  try {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS customers (
        sno SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        phone VARCHAR(20) NOT NULL,
        location VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`
    );
    console.log('Customers table created successfully or already exists.');
    // await insertDummyData();
  } catch (error) {
    console.error('Error creating customers table:', error.message);
  }
}

createTable();

// Insert 50 records with dummy data
async function insertDummyData() {
  try {
    for (let i = 1; i <= 50; i++) {
      await pool.query(
       ` INSERT INTO customers (customer_name, age, phone, location, created_at) VALUES ($1, $2, $3, $4, $5)`,
        [`Customer-${i+40}`, 60 + i,` 123-456-789${i.toString().padStart(2, '0')}`,` Noida`, new Date("2024-02-22 12:09:12.713+05:30")]
      );
    }
    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy data:', error.message);
  }
}
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await pool.query('SELECT * FROM customers ');
    res.json(customers.rows);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Your API endpoints for fetching customers, searching, sorting, and pagination


// Search customers
app.get('/api/customers/search', async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = `%${query}%`;
    const customers = await pool.query('SELECT * FROM customers WHERE customer_name ILIKE $1 OR location ILIKE $1', [searchQuery]);
    res.json(customers.rows);
  } catch (error) {
    console.error('Error searching customers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sort customers
app.get('/api/customers/sort_by_date', async (req, res) => {
  try {
    const customers = await pool.query(`SELECT * FROM customers ORDER BY DATE(created_at) `);
    res.json(customers.rows);
  } catch (error) {
    console.error('Error sorting customers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sort customers
app.get('/api/customers/sort_by_time', async (req, res) => {
  try {
    const customers = await pool.query(`SELECT * FROM customers ORDER BY DATE_PART('hour', created_at), DATE_PART('minute', created_at), DATE_PART('second', created_at) `);
    res.json(customers.rows);
  } catch (error) {
    console.error('Error sorting customers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
