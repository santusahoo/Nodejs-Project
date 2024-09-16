const jwt = require('jsonwebtoken');

const jwtmiddleware = (req, res, next) => {

    // first check if the authorization header is present
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({message: 'Token not found'});

    // extract the token from the header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({message: 'Unauthorized'});
    
    try {
        // verify the jwt token
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        // attach the user information to the request object
        req.user = decode;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({error: 'invalid token'});
    }
}

// function to generate jwt token
const generateToken = (user) => {
    // generate a jwt token using the user information
    return jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

module.exports = {jwtmiddleware, generateToken}; // export the middleware and the function