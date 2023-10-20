import React, { useEffect, useState } from 'react';
import axios from 'axios';
console.log("ProfilePage component rendered : MAIN");

function ProfilePage() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log("ProfilePage component rendered : useEffect");
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
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            <img src={userData.profileImage} alt="User Profile" width="200"/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default ProfilePage;
