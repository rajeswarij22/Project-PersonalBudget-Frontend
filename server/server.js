const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a connection pool
const pool = mysql.createPool({
  host: 'sql5.freemysqlhosting.net',
  user: 'sql5668783',
  password: 'gsdhRllsg9',
  database: 'sql5668783',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



// Use cors middleware
app.use(cors());

app.use('/', express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Angular app files
app.use('/angular-app', express.static('path/to/your/angular-app'));

// Route for Angular app
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'path/to/your/angular-app/index.html'));
});

// Serve static files
app.use('/styles', express.static('C:/Users/rajes/Downloads/NBAD1/personal-budget-app/public/styles'));
app.use(express.static('public'));


// Route for the root
app.get('/', (req, res) => {
  // Assuming your main HTML file is named 'index.html'
  res.sendFile('C:/Users/rajes/Downloads/NBAD1/personal-budget-app/public/index.html');
});

// Endpoint to fetch budget data
app.get('/budget', (req, res) => {
    const query = 'SELECT * FROM your_budget_table';
  
    pool.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error fetching data from MySQL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    });
  });

  
  // Check MySQL connection
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
      connection.release(); // Release the connection when done
    }
  });
  

// Endpoint to add a new budget item
app.post('/personal-budget', (req, res) => {
    const { title, budget, color } = req.body;
    const query = 'INSERT INTO your_budget_table (title, budget, color) VALUES (?, ?, ?)';
    const values = [title, budget, color];
  
    // Use the pool to get a connection
    pool.getConnection((error, connection) => {
      if (error) {
        console.error('Error getting MySQL connection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Use the connection for the query
        connection.query(query, values, (queryError, results, fields) => {
          // Release the connection when done
          connection.release();
  
          if (queryError) {
            console.error('Error inserting data into MySQL:', queryError);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log('Budget item saved:', results);
            res.status(201).json({ success: true, data: { title, budget, color } });
          }
        });
      }
    });
  });
  
// Endpoint to handle user login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Replace this with your actual user authentication logic
    const hashedPassword = 'hashed_password_here'; // Retrieve hashed password from your database
  
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
    if (passwordMatch) {
      // Generate a JWT token
      const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '20s' });
  
      res.json({ success: true, message: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


