const express = require('express');
const app = express();

app.use(express.json());

//endpoints
app.get('/', (req, res, next) => {
    res.send({ hello: 'world' });
});


module.exports = app;