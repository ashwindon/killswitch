// services/userService.js
const User = require('../models/user_data'); // Adjust the path according to your project structure
const { comparePassword } = require('../utils/passwordHelpers');
exports.loginService = async (credentials) => {
  const { email, password } = credentials;
  
  // Find the user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    // No user found with this email address
    throw new Error('User not found');
  }
  console.log("checking password");
  // Compare provided password with stored password
  const isMatch = await comparePassword(user.password, user.salt, password);
  console.log("password is correct");
  if (!isMatch) {
    // Passwords do not match
    throw new Error('Invalid password');
  }
  
  // User is authenticated, return user info (omit sensitive fields like password)
  const userDto = {
    id: user._id,
    success: true,
    username: user.userName,
    email: user.email,
    role: user.userRole // Assuming you have a role field in your user schema
  };
  console.log("returning user details, login is successful");
  return userDto;
};