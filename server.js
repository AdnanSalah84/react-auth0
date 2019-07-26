const express = require('express');
require('dotenv').config();

const app = express();

app.get('/public', function (reg, res) {
    res.json({
        message: 'Hello from a public API'
    })
})

app.listen(3001);
console.log('API sever listening on ' + process.env.REACT_APP_AUTH0_AUDIENCE);