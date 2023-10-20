const express = require('express');
const app = express();
const PORT = 3001;
const cors = require('cors');
const User = require('./models/user_data');
const connectDatabase  = require('./config/database_connection');
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




app.get('/', (req, res) => {
    res.send('Backend Server is running!');
});

app.post('/login', async (req, res) => {
    try {

        // Prepare the data payload using querystring encoding
        let data = qs.stringify({
            'grant_type': 'password',
            'client_id': `${process.env.CLIENT_ID}`,
            'client_secret': `${process.env.CLIENT_SECRET}`,
            'username': req.body.username,
            'password': req.body.password
        });

        // Define the request configuration
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `http://localhost:8080/realms/${process.env.REALM}/protocol/openid-connect/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'},
            data: data
        };

        // Make the request
        const response = await axios.request(config);

        // Set the token in the session
        req.session.token = response.data.access_token;
        req.session.refreshToken = response.data.refresh_token;

        // Decode the JWT token to extract username and roles
        const decodedToken = jwt.decode(response.data.access_token);
        const username = decodedToken.preferred_username; // 'preferred_username' is typically used by Keycloak
        const roles = decodedToken.realm_access ? decodedToken.realm_access.roles : []; // this assumes realm roles. Adjust if using client roles.
        req.session.userName = username;
       
        req.session.save();
        // Send the response
        res.send({ username, roles });

    } catch (err) {
        console.error(err); // It's a good practice to log the error for debugging purposes
        res.status(400).send('Authentication failed');
    }
});




app.get('/logout', async (req, res) => {
    try {

        const formData = qs.stringify({
            client_id: `${process.env.CLIENT_ID}`,
            client_secret: `${process.env.CLIENT_SECRET}`,
            refresh_token: req.session.refreshToken
        });

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        await axios.post(`http://localhost:8080/realms/${process.env.REALM}/protocol/openid-connect/logout`, formData, { headers });

        // Destroy the session on your server after logging out from Keycloak
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

    if (!userName) {
        return res.status(401).send({ error: 'User is not authenticated' });
    }

    try {
        const user = await User.findOne({ userName: userName });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Send relevant fields back to the client
        res.send({
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        });

    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
