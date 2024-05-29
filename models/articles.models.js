const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    let queryStr = "SELECT * FROM articles WHERE article_id = $1"
    return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject()
        };
        return rows[0]
    });
};