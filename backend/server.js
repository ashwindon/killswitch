const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const User = require('./models/user_data');
const connectDatabase  = require('./config/database_connection');
const { generateUniqueSalt, generateHashedPassword, comparePassword } = require('./utils/passwordHelpers');
const jwt = require('jsonwebtoken');
const qs = require('qs'); // This is a library for querystring encoding, install with npm if you haven't
const axios = require('axios');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(bodyParser.json());
app.set('trust proxy', 1); // trust first proxy

// ... other code ...
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoURI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
connectDatabase();
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's actual domain:port
    credentials: true
}));  // Add this line before your routes


app.use(session({
    secret: `${process.env.SECRET}`,  // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: mongoURI  // Directly providing mongo connection URI 
    }),
    cookie: {
        secure: false,  // Set to true if using HTTPS
        // sameSite:'none',
        // httpOnly: true,
        // maxAge: 1000 * 60 * 60 * 24  // 1 day
    }
}));


app.post('/login', async (req, res) => {
    try {   
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('User not found');
        }
        
        // Check if the password matches
        if (comparePassword(user.password, user.salt, password)) {
            req.session.userName = user.userName;
            req.session.userRole = user.userRole;
            req.session.save();
        
            return res.json({
              success: true,
              username: user.userName,
              role: user.userRole
            });
        } else {
            return res.status(400).send('Invalid password');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});


app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});


app.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.send('Logged out successfully');
    } catch (err) {
        // Handle any errors that occur during logout
        console.error("Error logging out from Keycloak:", err);
        res.status(500).send('Failed to log out from Keycloak');
    }
});


app.get('/userDetails', async (req, res) => {
   
    const userName = req.session.userName;
    const role = req.session.role; 
    if (!userName) {
        return res.status(401).send({ error: 'User is not authenticated' });
    }

    try {
        const user = await User.findOne({ userName: userName });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        // Send relevant fields back to the client
        res.send({
            username: user.userName,
            email: user.email,
            role: user.userRole,
            profileImage: user.profileImage,
            followers: user.followers,
            following: user.following
        });

    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if email already exists in the database
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('Email is already in use');
        }

        // Generate salt and hashed password
        const salt = generateUniqueSalt();
        const hashedPassword = generateHashedPassword(password, salt);
        
        const newUser = new User({
            email: email,
            userName: username,
            password: hashedPassword,  // Store the hashed password
            salt: salt,
            userRole: "admin"
        });

        await newUser.save();
        res.json({ success: true });
    
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
