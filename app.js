const express = require('express');
const app = express();
app.use(express.json());

const { getTopics } = require('./controllers/topics.controller');
const { getApi } = require('./controllers/api.controllers');


app.get('/api/topics', getTopics);
app.get('/api', getApi);


app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'});
});

module.exports = app