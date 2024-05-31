const { findTopics } = require('../models/topics.models')

exports.getTopics = (req, res, next) => {
    return findTopics()
    .then((data) => {
        res.status(200).send({ topics: data});
    })
    .catch((err) => {
        next(err);
    });
};