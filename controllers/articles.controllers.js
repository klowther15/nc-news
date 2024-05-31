const { selectArticleById , selectArticles , selectArticleComments , insertArticleComment , updateArticleVotes } = require('../models/articles.models')

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
    return selectArticles(req.query)
    .then((articles) => {
        res.status(200).send(articles);
    })
    .catch((err) => {
        next(err)
    });
};

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

exports.postArticleComments = (req, res, next) => {
    const { article_id } = req.params
    return insertArticleComment(article_id, req.body)
    .then((comment) => {
        res.status(201).send(comment)
    })
.catch((err) => {
    next(err)
});
};

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params
    return updateArticleVotes(article_id, req.body)
    .then((updateArticleVotes) => {
        res.status(200).send(updateArticleVotes)
    })
    .catch((err) => {
        next(err)
    });
};