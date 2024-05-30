const express = require('express');
const app = express();
app.use(express.json());

const { getTopics } = require('./controllers/topics.controller');
const { getApi } = require('./controllers/api.controllers');
const { getArticleById , getArticles, getArticleComments , postArticleComments , patchArticleVotes} = require('./controllers/articles.controllers');
const { psqlErrors } = require('./errors/index');


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments);

app.post('/api/articles/:article_id/comments', postArticleComments);

app.patch('/api/articles/:article_id', patchArticleVotes)


app.use(psqlErrors);


app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'});
});

module.exports = app