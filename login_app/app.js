const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const mysql = require('mysql');
const path = require('path');

const app = express();


// Firebase initialization
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your Firebase Admin SDK key
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://your-firebase-project-id.firebaseio.com', // Replace with your Firebase project URL
});

// MySQL database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'adi8877',
    database: 'test',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.set('view engine', 'ejs'); // Use EJS for rendering HTML templates

// Registration and Login Routes
app.get('/register', (req, res) => {
    res.render('register.ejs'); // Create a registration form (EJS template)
});

app.get('/otp', (req, res) => {
    res.render('otp.ejs'); // Create a registration form (EJS template)
});

app.post('/register', (req, res) => {
    console.log(req.body)
    const { phone, password } = req.body;
    console.log('Received registration request:', phone, password);

    // Implement Firebase registration logic with phone number
    admin.auth().createUser({
        phoneNumber: phone, // Use 'phoneNumber' for phone registration
        password: password,
    })
    .then((userRecord) => {
        // User successfully registered in Firebase

        // Now, store user details in MySQL
        const userData = {
            uuid: userRecord.uid,
            username: phone,
            password: password,
            // Add other user details as needed
        };

        db.query('INSERT INTO users SET ?', userData, (mysqlErr, results) => {
            if (mysqlErr) {
                console.error('Error storing user details in MySQL:', mysqlErr);
                res.status(500).json({ error: 'Registration failed' });
            } else {
                console.log('User registered and details stored in MySQL');
                // You can optionally set up a session here if needed
                // return res.status(200).json({ message: 'Registration successful' });
                res.redirect('/otp');
            }
        });
    })
    .catch((firebaseErr) => {
        console.error('Firebase registration error:', firebaseErr);
        res.status(500).json({ error: 'Registration failed' });
    });
});


// app.get('/login', (req, res) => {
//     res.render('login.ejs'); // Create a login form (EJS template)
// });

// app.post('/login', (req, res) => {
//     // Implement Firebase login logic here
//     // Set up session and redirect to dashboard on successful login
// });

// Dashboard Route and Middleware
app.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs', { user: req.session.user }); // Render the dashboard for authenticated users (EJS template)
});

function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
}

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
