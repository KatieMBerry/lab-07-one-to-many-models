const express = require('express');
const Alpaca_walker = require('./models/Alpaca_walker');
const app = express();

app.use(express.json());

//endpoints
app.post('/alpaca-walkers', (req, res, next) => {
    Alpaca_walker
        .insert(req.body)
        .then(alpaca_walker => res.send(alpaca_walker))
        .catch(next);
});


module.exports = app;