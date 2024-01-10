const {loginService} = require('../services/authService');

exports.loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Call the userService to handle the business logic
        const userDto = await loginService({ email, password });

        // Assuming you're using express-session to manage sessions
        // req.session.userId = userDto.id; // Storing user ID in the session
        // req.session.userName = userDto.username; // Storing username in the session
        console.log("userDto.username: ", userDto.username );
        req.session.userName = userDto.username;
        req.session.userRole = userDto.role;
        req.session.userID = userDto.id;
        req.session.save();
    
        return res.status(200).json({
          success: true,
          username: userDto.username,
          role: userDto.role
        });
        // Send a success response
        // return res.status(200).json({
        //     message: 'Login successful',
        //     user: userDto
        // });
    } catch (error) {
        // Error handling
        console.error('Login error:', error);
        return res.status(401).json({ message: error.message });
    }
};

//write a logout controller
exports.logoutController = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send('Logged out successfully');
    } catch (err) {
        // Handle any errors that occur during logout
        console.error("Error logging out from the application:", err);
        res.status(500).send('Failed to log out from the application');
    }
};

// try {   
//     const { email, password } = req.body;
    
//     const user = await User.findOne({ email });
    
//     if (!user) {
//         return res.status(400).send('User not found');
//     }
    
//     // Check if the password matches
//     if (comparePassword(user.password, user.salt, password)) {
//         req.session.userName = user.userName;
//         req.session.userRole = user.userRole;
//         req.session.save();
    
//         return res.json({
//           success: true,
//           username: user.userName,
//           role: user.userRole
//         });
//     } else {
//         return res.status(400).send('Invalid password');
//     }
// } catch (err) {
//     console.error(err);
//     res.status(500).send('Internal server error');
// }