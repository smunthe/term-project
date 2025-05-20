
const express = require('express');
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
const session = require('express-session');
const multer = require('multer');


const PORT = 3000;
const app = express();



app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',    // 🔑 Required for fetch + cookie
    maxAge: 1000 * 60 * 60 // optional: 1 hour
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));


// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// the about page

app.get('/about', (req, res) => {
    res.render('about', {
      pageTitle: 'About Us',
      stylesheet: '/styles.css', // or your custom about page style
      user: req.session.user || null
    });
  });
  


//for nightmare it should be the same
//going to do that when im free in a bit


//for dream

// app.get('/product[]', (req, res) => {
//   res.render('product', {
//     pageTitle: 'product name',
//     productName: 'product name',
//     productImage: '/assets/productImages/.png',
//     productDescription: 'edit here',

//     productPrice: 000000,

//     stylesheet: '/productStyle.css' 
//   });
// });

// Product page route

app.get('/product1', (req, res) => {
  res.render('product', {
    pageTitle: 'Dream House',
    productName: 'Dream House',
    // here goes the image just change after productImages
    productImage: '/assets/productImages/DreamHouse.png',
    //descption here any new proccut just copy and paste
    productDescription: 'edit here',

    productPrice: 20,

    stylesheet: '/productStyle.css'
  });
});


app.get('/product2', (req, res) => {
  res.render('product', {
    pageTitle: 'DreamCar',
    productName: 'DreamCar',
    productImage: '/assets/productImages/DreamCar.png',
    productDescription: 'edit here',
    stylesheet: '/productStyle.css' 
  });
});
  

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});








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
    userName TEXT UNIQUE,
    email TEXT UNIQUE,
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


function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

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

    db.get("SELECT * FROM Users WHERE userName = ?", [username], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Fetch after insert failed', error: err });
      }
      res.status(201).json(row);
    });
  });

  
});


app.get('/profile', (req, res) => {
 if (!req.session.user) return res.redirect('/login.html');
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM Users WHERE userName = ? AND password = ?`;
  db.get(query, [username, password], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    if (!row) return res.status(401).json({ success: false, error: 'Invalid login' });

    req.session.user = {
      username: row.userName,
      firstName: row.firstName,
      email: row.email,
      shippingAddress: row.shippingAddress,
      paymentMethod: row.paymentMethod,
      pfp: row.pfp || '/default-pfp.png',
      previouslyOrdered: row.previouslyOrdered
    };

    console.log("✅ SESSION SET:", req.session);
    res.json({ success: true });
  });
});


app.post('/upload-pfp', upload.single('pfp'), (req, res) => {
  if (!req.session.user) return res.status(401).send("Unauthorized");

  const imagePath = '/uploads/' + req.file.filename;
  const username = req.session.user.username;

  db.run('UPDATE Users SET pfp = ? WHERE userName = ?', [imagePath, username], err => {
    if (err) return res.status(500).send("Failed to update profile pic");
    req.session.user.pfp = imagePath; // Update session data too
    res.redirect('/profile');
  });
});


app.get('/index.html', checkLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/session', (req, res) => {
  console.log("SESSION CHECK:", req.session);
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// Start the server
// TODO ➡️ Start the server by listening on the specified PORT
app.listen(PORT, (err) => {
    if(err) {
        console.log("error in setup");
    } 
    console.log("Listening on Port");
})


app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

