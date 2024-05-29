const { selectArticleById , selectArticles , selectArticleComments } = require('../models/articles.models')

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
   return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    });
};

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send(articles);
    })
    .catch((err) => {
        next(err)
    });
}

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleComments(article_id)
    .then((comments) => {
        res.status(200).send(comments)
    })
    .catch((err) => {
        next(err)
    });
};