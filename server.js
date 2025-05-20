// collecting and creating user db

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const sqlite3 = require("sqlite3").verbose();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


const db = new sqlite3.Database("users.db", (err) => {
    if (err) {
        return console.error("Error opening database:", err.message);
    }
    console.log("Connected to the user database."); 

}); 




db.run(` CREATE TABLE IF NOT EXISTS Users (
    userName TEXT NOT NULL,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL,
    rePassword TEXT NOT NULL,
    shippingAddress TEXT DEFAULT 'empty',
    pfp TEXT DEFAULT 'empty', 
    paymentMethod TEXT DEFAULT 'empty', 
    orderedBefore TEXT DEFAULT 'empty', 
    wishList TEXT DEFAULT 'empty', 
    previouslyOrdered TEXT DEFAULT 'empty'
  )`, (err) => {
    if (err) {
        return console.error("Error creating table: ", err.message);
    }
    console.log("Users table created (if it didn't already exist).");
  });

  
// Add this route to server.js (before the /newUser GET route)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'newUser.html'));
});


app.get('/newUser', (req, res) => {
  db.all("SELECT * FROM Users", (err, rows) => {
      if (err) {
          console.error("Error fetching data:", err.message);
          return res.status(500).json({ message: "Database error", error: err.message });
      }
      res.json(rows); 
  });
});
// TODO ➡️ GET all todo items at the '/todos' path
app.get('/register', (req, res) => {
    //  res.json(todos);
    db.all("SELECT * FROM Users", (err, rows) => {
     if (err) {
       console.error("Error fetching data:", err.message);
       return res.status(500).json({ message: "Database error", error: err.message });
     }
     res.json(rows); 
   });
   
});
 
app.post('/register', (req,res) => {
    const {username, email, firstName, lastName, password, rePassword} = req.body; 

    // Basic validation
    if (!username || !email || !firstName || !lastName || !password || !rePassword) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== rePassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
  }
  const insertNewQuery = `
    INSERT INTO Users (userName, email, firstName, lastName, password, rePassword)
    VALUES (?,?,?,?,?,?)`;
db.run(
  insertNewQuery,
  [username, email, firstName, lastName, password, rePassword],
  function(err) {
    if (err) {
      return res.status(500).json({ message: 'Insert Failed', error: err });
    }

    db.get("SELECT * FROM Users WHERE username = ?", [username], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Fetch after insert failed', error: err });
      }
      res.status(201).json(row);
    });
  });

  
});

app.get('/profile', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send("Missing username");
  }

  db.get("SELECT * FROM Users WHERE userName = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (!row) {
      return res.status(404).send("User not found");
    }

    // You can render HTML or send JSON — for now, let's send simple HTML
    res.send(`
      <h1>Welcome, ${row.firstName} ${row.lastName}</h1>
      <p>Username: ${row.userName}</p>
      <p>Email: ${row.email}</p>
    `);
  });
});

// Start the server
// TODO ➡️ Start the server by listening on the specified PORT
app.listen(PORT, (err) => {
    if(err) {
        console.log("error in setup");
    } 
    console.log("Listening on Port");
})