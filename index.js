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
const auth = require('./routes/auth');
// ====================  RUN APP ====================
app.listen(4000, "localhost", () => {
    console.log("Server is running on http://localhost:4000");
})

// ====================  API ROUTES [ENDPOINTS] ====================
app.use('/auth', auth);