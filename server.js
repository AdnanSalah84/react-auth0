const express = require('express');
require('dotenv').config();
var jwt = require('express-jwt'); // Validate JWT and set req.user
var jwksRSA = require('jwks-rsa'); // Retrieve RSA keys from JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); // Validate JWT scopes

var checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header
    // and the signing keys provided by the JWKS endpoint.
    secret: jwksRSA.expressJwtSecret({
        cache: true,    // Cache the signing key
        rateLimit: true,
        jwksRequestsPerMinute: 5, // Prevent attackers from requesting more than 5 per minut
        jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

    // This must mactch the algorithm selected in the auth0 dashboard under your app's advance settings under the 0Auth tab
    algorithms: ['RS256']
});

const app = express();

app.get('/public', function (reg, res) {
    res.json({
        message: 'Hello from a public API'
    })
});

app.get('/private', checkJwt, function (reg, res) {
    res.json({
        message: 'Hello from a private API'
    })
});

app.get("/course", checkJwt, checkScope(["read:courses"]), function (req, res) {
    res.json({
        courses: [
            { id: 1, title: "Building Apps with React and Redux" },
            { id: 2, title: "Creating Reusable React Components" }
        ]
    });
});

function checkRole(role) {
    return function (req, res, next) {
        const assignedRoles = req.user['http://localhost:3000/roles'];
        if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
            return next();
        } else {
            return res.status(401).send('Insufficient role');
        }
    }
}

app.get('/admin', checkJwt, checkRole('admin'), function (reg, res) {
    res.json({
        message: 'Hello from an admin API'
    })
});

app.listen(3001);
console.log('API sever listening on ' + process.env.REACT_APP_AUTH0_AUDIENCE);