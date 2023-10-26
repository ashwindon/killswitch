const crypto = require('crypto');

// Generate a unique salt
function generateUniqueSalt() {
    return crypto.randomBytes(16).toString('hex'); // 16 bytes salt
}

// Generate hash using the given salt
function generateHashedPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
}

// Compare the input password with the hashed password using the salt
function comparePassword(storedHash, storedSalt, plainPassword) {
    const hash = generateHashedPassword(plainPassword, storedSalt);
    console.log("stored hash : " , storedHash);
    console.log("genera hash : " , hash);
    return storedHash === hash;
}

module.exports = {
  generateUniqueSalt,
  generateHashedPassword,
  comparePassword
};