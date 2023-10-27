import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';
import kilswitchLogo from '../assets/logo.png';
function ProfilePage() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log("ProfilePage component rendered : useEffect");
        window.document.addEventListener("prerender", function() {
            // Disable caching
            document.head.appendChild(
                Object.assign(document.createElement("meta"), {
                    name: "cache-control",
                    content: "no-cache, no-store, must-revalidate"
                })
            );
        });
        const fetchUserData = async () => {
            try {
                // Calling the userDetails API
                console.log('calling user details api')
                const response = await axios.get('http://localhost:3001/userDetails',{withCredentials:true});
                console.log('called user details api')
                // Set the user data to state
                setUserData(response.data);
            } catch (err) {
                console.log('error')
                console.log(err)
                // Checking if the error is a redirect due to unauthenticated request
                if (err.response && err.response.status === 302) {
                    window.location.href = "/login";
                } else if(err.response.status === 401){
                    console.log("Error : 401",err);
                    window.location.href = "/login";
                }else {
                    console.error("Error fetching user details", err);
                    // Handle other errors accordingly (e.g., show an error message to the user)
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            // Call the logout endpoint on your server
            await axios.get('http://localhost:3001/logout', { withCredentials: true });
            //history.replace("/login");
            
            // If successful, redirect to the login page
            window.location.href = "/login";
        } catch (err) {
            console.error("Error during logout", err);
            // Handle error accordingly (e.g., show an error message to the user)
        }
    };

    if (!userData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container">
            <header className="header">
                <img src={kilswitchLogo} alt="Kilswitch Logo" className="logo" />
                <h2>KILLSWITCH</h2>
            </header>
            <div className="body">
                <nav className="sidebar">
                    <a href="/dashboard">Dashboard</a><br/>
                    <a href="/settings">Settings</a><br/>
                    <button onClick={handleLogout}>Logout</button>
                    {/* Add other navigation links as needed */}
                </nav>
                <div className="profile">
                    <img src={userData.profileImage} alt="User Profile" className="profileImage" />
                    <p><strong>UserName:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Followers:</strong> {userData.followers}</p>
                    <p><strong>Following:</strong> {userData.following}</p>
                </div>
            </div>
        </div>
    );
    // return (
    //     <div style={styles.container}>
    //         <header style={styles.header}>
    //             <img src={kilswitchLogo} alt="Kilswitch Logo" style={styles.logo} />
    //         </header>
    //         <div style={styles.body}>
    //             <nav style={styles.sidebar}>
    //                 <a href="/dashboard">Dashboard</a>
    //                 <a href="/settings">Settings</a>
    //                 <button onClick={handleLogout}>Logout</button>
    //                 {/* Add other navigation links as needed */}
    //             </nav>
    //             <div style={styles.profile}>
    //                 <img src={user.profileImage} alt="User Profile" style={styles.profileImage} />
    //                 <p><strong>UserName:</strong> {userData.username}</p>
    //                 <p><strong>Email:</strong> {userData.email}</p>
    //                 <p><strong>Followers:</strong> {userData.followers}</p>
    //                 <p><strong>Following:</strong> {userData.following}</p>
    //             </div>
    //         </div>
    //     </div>
    // );
    // return (
    //     <div>
    //         <h1>Welcome, {userData.username}</h1>
    //         <p>Email: {userData.email}</p>
    //         <img src={userData.profileImage} alt="User Profile" width="200"/>
            
    //     </div>
    // );
}

export default ProfilePage;
