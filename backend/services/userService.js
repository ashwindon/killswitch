const { generateUniqueSalt, generateHashedPassword } = require('../utils/passwordHelpers');
const User = require('../models/user_data');
exports.userDetailsService = async (userDto) => {
    try{
        const {userName} = userDto;
        
        const user = await User.findOne({userName: userName});
        if(!user){
            throw new Error('User not found!');
        }

        return {
            username: user.userName,
            email: user.email,
            role: user.userRole,
            profileImage: user.profileImage,
            followers: user.followers,
            following: user.following
        };

    }catch(err){
        console.error(err);
        throw new Error('Internal server error');
    }
};

exports.signupService = async (userDto) => {
    try {
        const { email, username, password } = userDto;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new Error('Email is already in use!');
        }

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

        return { success: true };
    
    } catch (err) {
        console.error(err);
        throw new Error('Internal server error');
    }
};

// app.post('/signup', async (req, res) => {
//     try {
//         const { email, username, password } = req.body;

//         // Check if email already exists in the database
//         const existingUser = await User.findOne({ email: email });
//         if (existingUser) {
//             return res.status(400).send('Email is already in use');
//         }

//         // Generate salt and hashed password
//         const salt = generateUniqueSalt();
//         const hashedPassword = generateHashedPassword(password, salt);
        
//         const newUser = new User({
//             email: email,
//             userName: username,
//             password: hashedPassword,  // Store the hashed password
//             salt: salt,
//             userRole: "admin"
//         });

//         await newUser.save();
//         res.json({ success: true });
    
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal server error');
//     }
// });