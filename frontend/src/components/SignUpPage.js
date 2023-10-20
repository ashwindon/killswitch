// SignUpPage.js
import React, { useState } from 'react';
import './SignUpPage.css';
import './LoginPage.css';
import { Link } from 'react-router-dom';
const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Handle the sign-up logic here
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
