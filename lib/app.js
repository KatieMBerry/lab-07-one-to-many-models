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

app.get('/alpaca-walkers', (req, res, next) => {
    Alpaca_walker
        .find()
        .then(alpaca_walker => res.send(alpaca_walker))
        .catch(next);
});

app.get('/alpaca-walkers/:id', (req, res, next) => {
    Alpaca_walker
        .findById(req.params.id)
        .then(alpaca_walker => res.send(alpaca_walker))
        .catch(next);
});

app.put('/alpaca-walkers/:id', (req, res, next) => {
    Alpaca_walker
        .update(req.params.id, req.body)
        .then(alpaca_walker => res.send(alpaca_walker))
        .catch(next);
});

app.delete('/alpaca-walkers/:id', (req, res, next) => {
    Alpaca_walker
        .delete(req.params.id)
        .then(alpaca_walker => res.send(alpaca_walker))
        .catch(next);
});

module.exports = app;