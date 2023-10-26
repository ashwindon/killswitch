// SignUpPage.js
import React, { useState } from 'react';
import './SignUpPage.css';
import './LoginPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3001/signup', {                
                email: email,
                username: name,
                password: password
            });
    
            if (response.data.success) {
                alert('Signup successful! You can now log in.');
                // Redirect to login page or homepage, or handle as needed
                // For example:
                window.location.href = '/login';
            } else {
                // Handle server validation messages or other errors
                alert('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('There was an error signing up:', error);
            // Handle error (e.g., display a notification or alert to the user)
            alert('There was an error signing up. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-box" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input
                    type="text"
                    placeholder="UserName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
                <div className="signup-text">
                    <Link to="/login">
                        Already have an account? Log In!
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;
