const express = require('express');
const path = require('path');

const app = express();

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
