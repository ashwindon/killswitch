const userService = require('../services/userService');
// write a signup controller
exports.signupController = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validate input
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Email, username and password are required' });
        }

        // Call the userService to handle the business logic
        const userDto = await userService.signupService({ email, username, password });

        // Send a success response
        return res.status(200).json({
            message: 'Signup successful',
            success: true
        });
    } catch (error) {
        // Error handling
        console.error('Signup error:', error);
        return res.status(500).json({ message: error.message });
    }
};

exports.userDetailsController = async (req, res) =>{
    try{
        const userDetails = await userService.userDetailsService({userName: req.session.userName});

        if(!userDetails){
            console.log("User is not found");
            return res.status(404).send({error: 'User not found'});
        }

        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', '0');
        console.log("returning user details, login is successful");
        return res.status(200).json({
            message: 'User details fetched successfully',
            userDetails : userDetails
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({ message: error.message });
    }
};