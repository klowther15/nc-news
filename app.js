const express = require('express');
const app = express();
app.use(express.json());

const { getTopics } = require('./controllers/topics.controller');
const { getApi } = require('./controllers/api.controllers');
const { getArticleById , getArticles, getArticleComments} = require('./controllers/articles.controllers');
const { psqlErrors } = require('./errors/index');


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments)


app.use(psqlErrors);


app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'});
});

module.exports = app