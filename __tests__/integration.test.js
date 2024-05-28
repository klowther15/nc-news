const db = require('../db/connection')
const data = require('../db/data/test-data')
const { seed } = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')
const Test = require('supertest/lib/test')

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
});