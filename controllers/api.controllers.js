
const endpoints = require('../endpoints.json')
const fs = require('fs/promises')
const path = require('path')


exports.getApi = (req, res, next) => {
    return fs.readFile('./endpoints.json', 'utf-8')
    .then((endpoints) => {
        res.status(200).send(JSON.parse(endpoints))
    })
    .catch((err) => {
        next(err)
    });
};