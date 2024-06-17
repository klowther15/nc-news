const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());


const { getTopics } = require('./controllers/topics.controller');
const { getApi } = require('./controllers/api.controllers');
const { getArticleById , getArticles, getArticleComments , postArticleComments , patchArticleVotes} = require('./controllers/articles.controllers');
const { psqlErrors, customErrors } = require('./errors/index');
const { deleteCommentById } = require('./controllers/comments.controllers');
const { getUsers } = require('./controllers/users.controllers');


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments);
app.get('/api/users', getUsers);

app.post('/api/articles/:article_id/comments', postArticleComments);

app.patch('/api/articles/:article_id', patchArticleVotes);

app.delete('/api/comments/:comment_id', deleteCommentById);


app.use(psqlErrors);
app.use(customErrors);


app.all('*', (req, res) => {
    res.status(404).send({msg: 'Route not found'});
});

module.exports = app