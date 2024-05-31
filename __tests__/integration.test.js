const db = require('../db/connection')
const data = require('../db/data/test-data')
const { seed } = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET: api/topics', () => {
    test('200: responds successfully with a list of all topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(body.topics).toHaveLength(3);
            body.topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug");
                expect(topic).toHaveProperty("description");
            });
        });
    });
});

describe('GET: /api', () => {
    test('200: responds successfully with a list of all endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const endpoints = require('../endpoints.json')
            expect(Object.keys(body).length).toEqual(Object.keys(endpoints).length)
        for(const key in body){
            const endpoint = body[key]
            expect(endpoint).toHaveProperty("description")
            expect(endpoint).toHaveProperty("queries")
            expect(endpoint).toHaveProperty("exampleResponse")
            };
        });
    });
});

describe('GET: api/articles/:article_id', () => {
    test('200: responds with a single article by id', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveProperty("author")
            expect(body).toHaveProperty("title")
            expect(body).toHaveProperty("article_id")
            expect(body).toHaveProperty("body")
            expect(body).toHaveProperty("topic")
            expect(body).toHaveProperty("created_at")
            expect(body).toHaveProperty("votes")
            expect(body).toHaveProperty("article_img_url")
        });
    });
    test('400: responds with appropriate error message when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/invalidId')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
});

describe('GET: api/articles', () => {
    test('200: responds successfully with a list of all articles with a comment_count property and order sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {

            expect(body).toBeSortedBy("created_at", {
                descending: true,
                coerce: true,
        });
            expect(body).toHaveLength(13);
            body.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("article_id");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
                expect(article).toHaveProperty("comment_count")
                expect(article).not.toHaveProperty("body");
            });
        });
    });
});

describe('GET/api/articles/:article_id/comments', () => {
    test('200: responds successfully with an array of all comments for the given article id, in date descending order', () => {
        return request(app)
        .get('/api/articles/5/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveLength(2)
            expect(body).toBeSortedBy("created_at", {
                descending: true,
                coerce: true,
        });
            body.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id")
                expect(comment).toHaveProperty("votes")
                expect(comment).toHaveProperty("created_at")
                expect(comment).toHaveProperty("author")
                expect(comment).toHaveProperty("body")
                expect(comment.article_id).toBe(5)
            });// add test 200 for empty array when no comments
        });
    });
    test('200: responds with empty array when given an article number that has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual([])
        })
    })
    test('400: responds with appropriate error message when given an invalid article_id', () => {
        return request(app)
        .get('/api/articles/invalidId/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
});

describe('POST/api/articles/:article_id/comments', () => {
    test('201: inserts new comment successfully and responds with posted comment', () => {
        const newComment = {
            username: "butter_bridge",
            body: "comment on the article"
        };
        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
            expect(body.author).toBe("butter_bridge")
            expect(body.body).toBe("comment on the article")
        });
    });
    test('400: Sends appropriate error status and message when passed malformed object', () => {
        const badRequest = {
            username: "katie",
            body: null
        };
        return request(app)
        .post('/api/articles/1/comments')
        .send(badRequest)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        });
    });
});

describe('PATCH: api/articles/:article_id', () => {
    test('200: identifies article id and adds to an articles votes value when given integer', () => {
        const articleVotes = {
            inc_votes: 8
        };
        return request(app)
        .patch('/api/articles/3')
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.votes).toBe(8)
            expect(body).toHaveProperty("author");
            expect(body).toHaveProperty("title");
            expect(body).toHaveProperty("article_id");
            expect(body).toHaveProperty("topic");
            expect(body).toHaveProperty("created_at");
            expect(body).toHaveProperty("votes");
            expect(body).toHaveProperty("article_img_url");
        });
    });
    test('200: identifies article id and subtracts from an articles votes value when given a negative number', () => {
        const articleVotes = {
            inc_votes: -15
        };
        return request(app)
        .patch('/api/articles/3')
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.votes).toBe(-15)
            expect(body).toHaveProperty("author");
            expect(body).toHaveProperty("title");
            expect(body).toHaveProperty("article_id");
            expect(body).toHaveProperty("topic");
            expect(body).toHaveProperty("created_at");
            expect(body).toHaveProperty("votes");
            expect(body).toHaveProperty("article_img_url");
        });
    });
    test('200: identifies article id and adds to articles votes when vote count is not initially 0', () => {
        const articleVotes = {
            inc_votes: 27
        };
        return request(app)
        .patch('/api/articles/1')
        .send(articleVotes)
        .expect(200)
        .then(({ body }) => {
            expect(body.votes).toBe(127)
            expect(body).toHaveProperty("author");
            expect(body).toHaveProperty("title");
            expect(body).toHaveProperty("article_id");
            expect(body).toHaveProperty("topic");
            expect(body).toHaveProperty("created_at");
            expect(body).toHaveProperty("votes");
            expect(body).toHaveProperty("article_img_url");
        });
    });
    test('400: sends appropriate error message when passed an invalid key type', () => {
        const badArticleVotes = {
            inc_votes: "hello"
        };
        return request(app)
        .patch('/api/articles/1')
        .send(badArticleVotes)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
    test('404: responds with appropriate error message when article_id does not exist', () =>{
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found')
        });
    });
    test('400: responds with appropriate error message when passed invalid article_id', () =>{
        return request(app)
        .get('/api/articles/invalid')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        });
    });
});

describe('DELETE: api/comments/:comment_id', () => {
    test('204: sends 204 status when comment is deleted', () => {
        return request(app)
        .delete('/api/comments/14')
        .expect(204)
    });
    test('404: sends 404 status and message when comment id does not exist', () => {
        return request(app)
        .delete('/api/comments/8490')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Comment Not Found")
        })
    });
    test('400: responds with appropriate error message when passed invalid comment_id', () =>{
        return request(app)
        .delete('/api/comments/invalid')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request')
        });
    });
});

describe('GET: api/users', () => {
    test('200: responds with a list of all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveLength(4)
            body.forEach((user) =>{
                expect(user).toHaveProperty("username")
                expect(user).toHaveProperty("name")
                expect(user).toHaveProperty("avatar_url")
            });
        });
    });
});

describe('GET: api/articles?topic', () => {
    test('200: responds successfully with articles with specific topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body }) => {
            expect(body).toHaveLength(1)
            body.forEach((article) => {
                expect(article.topic).toBe("cats")
            });
        });
    });
    test('404: gives appropriate error when topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=banana')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Not Found")
        })
    })
});

//  404 testing //
describe('404: reponds to any unfound path', () => {
    test('404: responds with appropriate error message when path not found', () => {
        return request(app)
        .get('/api/not-found')
        .expect(404)
        .then(({ body}) => {
            expect(body.msg).toBe('Route not found')
        });
    });
    test('404: responds with appropriate error message when path not found',() => {
        return request(app)
        .get('/ap')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        });
    });
    test('404: responds with appropriate error message when article_id does not exist', () =>{
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found')
        });
    });
    test('404: responds with appropriate error message when article_id does not exist', () =>{
        return request(app)
        .get('/api/articles/99999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        });
    });
});