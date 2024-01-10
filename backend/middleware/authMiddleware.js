//write a middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
    if (req.session && req.session.userName) {
        next();
    }else{
        return res.status(401).send({ error: 'User is not authenticated' });
    }
};

module.exports = authMiddleware;