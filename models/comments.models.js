const db = require('../db/connection')

exports.removeCommentById = (comment_id) => {
    let queryStr = `DELETE FROM comments WHERE comment_id = $1;`
    return db
    .query(queryStr, [comment_id])
    .then(({rowCount}) => {
        if(rowCount === 0){
            return Promise.reject({status: 404, msg: "Comment Not Found"});
        };
    });
};