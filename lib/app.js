const express = require('express');
const Alpaca_walker = require('./models/Alpaca_walker');
const Alpaca = require('./models/Alpaca');
const app = express();

app.use(express.json());

//alpaca-walkers endpoints
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

//alpacas endpoints
app.post('/alpacas', (req, res, next) => {
    Alpaca
        .insert(req.body)
        .then(alpaca => res.send(alpaca))
        .catch(next);
});

app.get('/alpacas', (req, res, next) => {
    Alpaca
        .find()
        .then(alpaca => res.send(alpaca))
        .catch(next);
});

app.get('/alpacas/:id', (req, res, next) => {
    Alpaca
        .findById(req.params.id)
        .then(alpaca => res.send(alpaca))
        .catch(next);
});

app.put('/alpacas/:id', (req, res, next) => {
    Alpaca
        .update(req.params.id, req.body)
        .then(alpaca => res.send(alpaca))
        .catch(next);
});

app.delete('/alpacas/:id', (req, res, next) => {
    Alpaca
        .delete(req.params.id)
        .then(alpaca => res.send(alpaca))
        .catch(next);
});

module.exports = app;