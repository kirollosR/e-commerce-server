// ==================== INITIALIZE EXPRESS APP ====================
const express = require('express');
const app = express();

// ====================  GLOBAL MIDDLEWARE ====================
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('upload'));
const cors = require("cors");
app.use(cors()); // ALLOW HTTP REQUESTS LOCAL HOSTS (frontend talk to backend)

// ====================  REQUIRE MODULES ====================
const {router: auth} = require('./routes/auth');
const categories = require('./routes/categories');
const products = require('./routes/products');
const {router: cart} = require('./routes/cart');
const orders = require('./routes/orders');
const user = require('./routes/user');
const authorized = require('./middlewares/authorize');
const admin = require('./middlewares/admin');
// ====================  RUN APP ====================
// app.listen(4000, "localhost", () => {
//     console.log("Server is running on http://localhost:4000");
// })

app.listen(process.env.PORT || 4000, () => {

})
app.get('/', (req, res) => {
    res.send('Welcome to E-Commerce Server');
});

// ====================  API ROUTES [ENDPOINTS] ====================
app.use('/auth', auth);
app.use('/categories', categories);
app.use('/products', products)
app.use('', authorized, cart);
app.use('/orders', authorized, orders);
app.use('', authorized, user);