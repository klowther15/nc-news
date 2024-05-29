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
            expect(body.msg).toBe('Route not found')
        });
    });
});