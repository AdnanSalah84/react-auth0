const express = require('express');
require('dotenv').config();
var jwt = require('express-jwt'); // Validate JWT and set req.user
var jwksRSA = require('jwks-rsa'); // Retrieve RSA keys from JSON Web Key set (JWKS) endpoint
var checkScope = require('express-jwt-authz'); // Validate JWT scopes

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

app.get('/courses', checkJwt, checkScope(['read:courses']), function (reg, res) {
    res.json({
        courses: [
            { id: 1, title: 'Building Apps with React and Redux' },
            { id: 2, title: 'Creating Resable React Components' }
        ]
    })
});

app.listen(3001);
console.log('API sever listening on ' + process.env.REACT_APP_AUTH0_AUDIENCE);