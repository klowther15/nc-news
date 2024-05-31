const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    let queryStr = "SELECT * FROM articles WHERE article_id = $1;"
    return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject({ status: 404, msg: "Article Not Found"})
        };
        return rows[0];
    });
};

exports.selectArticles = (query) => {
  
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    const queryValues = []

    if(query.topic){
        queryValues.push(query.topic)
        queryStr += ` WHERE articles.topic = $${queryValues.length}`
    }

    queryStr += ` GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url ORDER BY articles.created_at DESC;`

    return db.query(queryStr, queryValues)
    .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return rows
    });
};

exports.selectArticleComments = (article_id) => {
    let queryStr = `SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`
    return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject()
        };
        return rows;
    });//add error handling
};

exports.insertArticleComment = (article_id, newComment) => {
    const { username , body } = newComment
    const queryStr = `INSERT INTO comments (article_id, body, author) 
    VALUES ($1, $2, $3) RETURNING *;`
    return db
    .query(queryStr, [article_id, body, username])
    .then(({rows}) => {
        return rows[0]
    });
};

exports.updateArticleVotes = (article_id, newVotes) => {
    const voteValue = newVotes.inc_votes
    const queryStr = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`
    return db
    .query(queryStr, [voteValue, article_id])
    .then(({ rows }) => {
        return rows[0]
    });
};