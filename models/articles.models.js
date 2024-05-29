const db = require('../db/connection')

exports.selectArticleById = (article_id) => {
    let queryStr = "SELECT * FROM articles WHERE article_id = $1;"
    return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
        if(!rows.length){
            return Promise.reject()
        };
        return rows[0]
    });
};

exports.selectArticles = () => {
    //LEFT join COMMENTS on articles id
    //GROUP BY article id

    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url 
    ORDER BY articles.created_at DESC;`
    return db.query(queryStr).then(({ rows }) => {
        return rows
    });
};