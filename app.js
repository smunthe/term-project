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
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60,
    secure: false // 🔥 FORCE OFF in dev mode
  }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 🔄 Product data - used for both homepage and dynamic product pages
const products = [
  { id: 1, name: 'Dream House', image: '/assets/productImages/dreamHouse.png', description: 'A cozy retreat built from imagination.', price: 20 },
  { id: 2, name: 'Dream Car', image: '/assets/productImages/DreamCar.png', description: 'Runs on sparkles and clouds.', price: 100 },
  { id: 3, name: 'Dream Pet', image: '/assets/productImages/DreamPet.png', description: 'Your cuddliest companion yet.', price: 15 },
  { id: 4, name: 'Dream Partner', image: '/assets/productImages/DreamPartner.png', description: 'Someone who understands your vibes.', price: 25 },
  { id: 5, name: 'Dream Job', image: '/assets/productImages/DreamJob.png', description: 'Work without burnout or meetings.', price: 35 },
  { id: 6, name: 'Dream Career', image: '/assets/productImages/DreamCareer.png', description: 'Ocean breeze & pastel skies.', price: 50 },
  { id: 7, name: 'Dream Scenario', image: '/assets/productImages/DreamScenario.png', description: 'Always fits, always cute.', price: 18 },
  { id: 8, name: 'Healing Nightmares', image: '/assets/productImages/HealingNightmare.png', description: 'No tests, just fun learning.', price: 40 },
  { id: 9, name: 'Retrieve Dream', image: '/assets/productImages/RetrieveDream.png', description: 'That perfect moment, on repeat.', price: 22 },
  { id: 10, name: 'Nightmare Protection', image: '/assets/productImages/NightmareProtection.png', description: 'Sleep peacefully, always.', price: 10 },
  { id: 11, name: 'Nightmare Roulette', image: '/assets/productImages/RouletteNightmare.png', description: 'Spin your fate.', price: 60 },
  { id: 12, name: 'Send a Nightmare', image: '/assets/productImages/SendNightmare.png', description: 'A spooky surprise for your enemy.', price: 30 }
];

// the about page

app.get('/about', (req, res) => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "You can't return dreams. Trust us—we tried. All purchases are final, just like that embarrassing thing you did in 8th grade."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, our dreams transcend borders, time zones, and occasionally the laws of physics. If you're asleep, we ship."
    },
    {
      question: "How can I contact customer support?",
      answer: "Simply meditate under a full moon wearing a top hat and whisper your issue into the breeze. We’ll get back to you in 3–5 dream cycles."
    },
    {
      question: "Can I customize my dream?",
      answer: "Absolutely. Choose from our Dream Buffet™ — includes flying, underwater concerts, and awkward high school reunions."
    },
    {
      question: "What if I accidentally dream about my ex?",
      answer: "That’s on you. We recommend upgrading to our 'Exorcise the Ex' add-on package."
    },
    {
      question: "Is there a warranty?",
      answer: "Your dream comes with a 14-night no-reality-distortion guarantee. Side effects may include ambition and mild euphoria."
    },
    {
      question: "Do your dreams work on pets?",
      answer: "Yes. Side effects include tail wagging, uncontrollable purring, and dreaming of infinite bacon."
    },
    {
      question: "Can I share a dream with a friend?",
      answer: "Yes, but only if you're emotionally synced and have matching pajamas. That's just the policy."
    },
    {
      question: "Are your dreams ethically sourced?",
      answer: "100% certified cruelty-free and harvested sustainably from the subconscious minds of retired poets."
    },
    {
      question: "Do you offer nightmares?",
      answer: "Yes! For thrill-seekers only. Comes with built-in escape hatch and complimentary therapy suggestions."
    }
  ];

  res.render('about', {
    pageTitle: 'About Us',
    faqs,
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

// app.get('/product1', (req, res) => {
//   res.render('product', {
//     pageTitle: 'Dream House',
//     productName: 'Dream House',
//     // here goes the image just change after productImages
//     productImage: '/assets/productImages/DreamHouse.png',
//     //descption here any new proccut just copy and paste
//     productDescription: 'edit here',

//     productPrice: 20,

//     stylesheet: '/productStyle.css'
//   });
// });


// app.get('/product2', (req, res) => {
//   res.render('product', {
//     pageTitle: 'DreamCar',
//     productName: 'DreamCar',
//     productImage: '/assets/productImages/DreamCar.png',
//     productDescription: 'edit here',
//     stylesheet: '/productStyle.css' 
//   });
// });
  








// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');  // ✅ allow cookies!
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// SQLite setup
const db = new sqlite3.Database("users.db", (err) => {
  if (err) return console.error("Error opening database:", err.message);
  console.log("Connected to the user database.");
});

db.run(`CREATE TABLE IF NOT EXISTS Users (
  userName TEXT UNIQUE,
  email TEXT UNIQUE,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  password TEXT NOT NULL,
  rePassword TEXT NOT NULL,
  shippingAddress TEXT DEFAULT 'empty',
  pfp TEXT DEFAULT 'empty', 
  paymentMethod TEXT DEFAULT 'empty', 
  wishList TEXT DEFAULT '[]', 
  cartItems TEXT DEFAULT '[]',
  previouslyOrdered TEXT DEFAULT '[]'
)`, (err) => {
  if (err) return console.error("Error creating table: ", err.message);
  console.log("Users table created (if it didn't already exist).");
});

// Middleware to protect routes
function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
  const user = req.session.user || null;
  let wishList = [];

  if (user && user.wishList) {
    try {
      wishList = JSON.parse(user.wishList);
    } catch {
      wishList = [];
    }
  }

  res.render('storefront', {
    title: 'DreamStore',
    products,
    user,
    wishList
  });
});

// 🆕 Dynamic route for product pages
app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).send("Product not found");

  res.render('product', {
    pageTitle: product.name,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    productDescription: product.description,
    productPrice: product.price,
    user: req.session.user || null // ✅ Add this
  });
});

// app.get('/index', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login Page',
    user: req.session.user || null 
  });
});

app.get('/register', (req, res) => {
  res.render('register', {
    user: req.session.user || null 
  });
});

app.post('/register', (req, res) => {
  const { username, email, firstName, lastName, password, rePassword } = req.body;
  if (!username || !email || !firstName || !lastName || !password || !rePassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password !== rePassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const insertQuery = `INSERT INTO Users (userName, email, firstName, lastName, password, rePassword) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(insertQuery, [username, email, firstName, lastName, password, rePassword], function (err) {
    if (err) return res.status(500).json({ message: 'Insert failed', error: err });

    db.get("SELECT * FROM Users WHERE userName = ?", [username], (err, row) => {
      if (err || !row) return res.status(500).json({ message: 'Fetch after insert failed', error: err });

      // 🔐 Set up session
      req.session.user = {
        username: row.userName,
        firstName: row.firstName,
        email: row.email,
        shippingAddress: row.shippingAddress,
        paymentMethod: row.paymentMethod,
        pfp: row.pfp || '/default-pfp.png',
        previouslyOrdered: row.previouslyOrdered,
        cartItems: row.cartItems || '[]'
      };

      res.status(201).json({ success: true });
    });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM Users WHERE userName = ? AND password = ?", [username, password], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    if (!row) return res.status(401).json({ success: false, error: 'Invalid login' });

    req.session.user = {
      username: row.userName,
      firstName: row.firstName,
      email: row.email,
      shippingAddress: row.shippingAddress,
      paymentMethod: row.paymentMethod,
      pfp: row.pfp || '/default-pfp.png',
      previouslyOrdered: row.previouslyOrdered,
      cartItems: row.cartItems || '[]'
    };

    console.log("✅ SESSION SET:", req.session);
    res.json({ success: true });
  });
});

app.get('/profile', checkLogin, (req, res) => {
  const username = req.session.user.username;
  const favoriteIds = [...new Set(JSON.parse(req.session.user.wishList || '[]'))];
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  db.get("SELECT previouslyOrdered FROM Users WHERE userName = ?", [username], (err, row) => {
    if (err) {
      console.error("❌ Failed to fetch previous orders:", err.message);
      return res.status(500).send("Server error");
    }

    let orders = [];
    try {
      orders = JSON.parse(row.previouslyOrdered || '[]');
    } catch (e) {
      console.error("❌ Failed to parse previous orders:", e);
    }

    res.render('profile', {
      title: 'Your Profile',
      user: req.session.user,
      orders,
      favoriteProducts // ✅ new variable
    });
  });
});

app.get('/orders', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const username = req.session.user.username;

  db.get("SELECT previouslyOrdered FROM Users WHERE userName = ?", [username], (err, row) => {
    if (err) return res.status(500).send("Database error");

    let orders = [];
    try {
      orders = JSON.parse(row.previouslyOrdered || '[]');
    } catch (e) {
      console.error("❌ Order parse failed:", e);
    }

    res.render('orders', { orders });
  });
});


app.get('/shopingcart', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  res.render('shopingcart', {
    shopingcart: req.session.shopingcart || [],
    user: req.session.user || null // ✅ Add this
  });
});


app.post('/shopingcart/remove', (req, res) => {
  const { productId } = req.body;

  if (!req.session.shopingcart) {
    return res.redirect('/shopingcart');
  }

  req.session.shopingcart = req.session.shopingcart.filter(item => item.id !== Number(productId));
  res.redirect('/shopingcart');
});


app.post('/shopingcart/add', (req, res) => {
  const { productId, quantity, customization } = req.body;
  const product = products.find(p => p.id === Number(productId));

  if (!product) return res.status(400).send('Invalid product');

  if (!req.session.shopingcart) {
    req.session.shopingcart = [];
  }

  const existingItem = req.session.shopingcart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    req.session.shopingcart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: Number(quantity),
      customization: customization || ''
    });
  }

  res.redirect('/shopingcart');
});

// POST /shopingcart/update
app.post('/shopingcart/update', express.urlencoded({ extended: true }), (req, res) => {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity);

  if (!req.session.shopingcart) req.session.shopingcart = [];

  const itemIndex = req.session.shopingcart.findIndex(item => String(item.id) === String(productId));
  if (itemIndex === -1) {
    return res.redirect('/shopingcart'); // or handle error however you want
  }

  if (isNaN(qty) || qty < 1) {
    return res.redirect('/shopingcart');
  }

  req.session.shopingcart[itemIndex].quantity = qty;

  res.redirect('/shopingcart');  // Redirect back to cart page
});

app.get('/checkout', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (!req.session.shopingcart || req.session.shopingcart.length === 0) {
    return res.redirect('/shopingcart');
  }

  res.render('checkout', {
    title: 'Checkout',
    cart: req.session.shopingcart,
    user: req.session.user
  });
});


app.post('/checkout', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const cart = req.session.shopingcart || [];
  const username = req.session.user.username;

  db.get("SELECT previouslyOrdered FROM Users WHERE userName = ?", [username], (err, row) => {
    if (err) return res.status(500).send("Database error");

    let cart = [], prevORders = [];
    try {
      cart = JSON.parse(row.cartItems || '[]');
      prevOrders = JSON.parse(row.previouslyOrdered || '[]');
    } catch (e) {
      console.error("❌ Order parse failed:", e);
    }

    // Create a new grouped order with date
    const newOrder = {
      date: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
      items: cart
    };

    const updatedOrders = [newOrder, ...prevOrders]; // newest first

    db.run(
    `UPDATE Users SET previouslyOrdered = ?, cartItems = '[]' WHERE userName = ?`,
    [JSON.stringify(newOrders), username],
    err => {
      if (err) return res.status(500).send("Failed to save order");

      req.session.user.previouslyOrdered = JSON.stringify(newOrders);
      req.session.user.cartItems = '[]'; // optional if you still track this
      res.redirect('/profile');
    }
    );
  });
});

app.post('/upload-pfp', upload.single('pfp'), (req, res) => {
  if (!req.session.user) return res.status(401).send("Unauthorized");

  const imagePath = '/uploads/' + req.file.filename;
  const username = req.session.user.username;

  db.run('UPDATE Users SET pfp = ? WHERE userName = ?', [imagePath, username], err => {
    if (err) return res.status(500).send("Failed to update profile pic");
    req.session.user.pfp = imagePath;
    res.redirect('/profile');
  });
});


app.get('/settings', (req,res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('settings', {title: 'User Settings', user: req.session.user});

});

app.post('/settings', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  
  const { firstName, shippingAddress, email, paymentMethod } = req.body;
  const username = req.session.user.username;

  const updateQuery = `
    UPDATE Users
    SET firstName = ?, shippingAddress = ?, email = ?, paymentMethod = ?
    WHERE userName = ?
  `;

  db.run(updateQuery, [firstName, shippingAddress, email, paymentMethod, username], function(err) {
    if (err) {
      console.error("❌ Failed to update user:", err.message);
      return res.status(500).send("Failed to update settings");
    }

    // 🔄 Update the session so profile reflects changes
    req.session.user.firstName = firstName;
    req.session.user.shippingAddress = shippingAddress;
    req.session.user.email = email;
    req.session.user.paymentMethod = paymentMethod;

    res.redirect('/profile'); // ✅ Go back to profile
  });
});

app.get('/api/session', (req, res) => {
  console.log("SESSION CHECK:", req.session); // 🔍 Watch this in terminal
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
