// LoginPage.js
import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username: email,
                password: password
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true  // <-- This ensures cookies are sent with the request
            });

            // In axios, the status code 200 and 299 indicate success
            if (response.status >= 200 && response.status < 300) {
                console.log('successful login');
                sessionStorage.setItem('username', response.data.username);
                // sessionStorage.setItem('roles', JSON.stringify(response.data.roles));
                window.location.href = "/profile";
            } else {
                // This block might not be needed because axios will throw an error 
                // for non 2xx status codes, but it's here for clarity.
                alert('Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error("Login failed", err);
            alert('Login failed. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            
            <form className="login-box" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    //pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})"
                    //title="Must contain at least one lower case letter, one upper case letter, one special character, and be at least 8 characters long"
                    required
                />
                <button type="submit">Login</button>
                <div className="signup-text">
                    <Link to="/signup">
                        Don't have an account? Sign Up!
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;