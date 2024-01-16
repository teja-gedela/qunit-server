const express = require('express');
const userService = require('../services/UserService.js');

const TAG = 'UserRoute.js';
const app = express();

class UserRoute {
    signup(req, res, next) {
        let input = {};
        input = { ...input, ...req.body };
        console.log(TAG, ' in create user', input);
        userService.createUser(input)
            .then(resp => {
                res.statusCode = resp.http_code;
                res.json(resp.message);
            })
            .catch(err => {
                next(err);
            });
    }

    login(req, res, next) {
        let input = {};
        input = { ...input, ...req.body };
        console.log(TAG, ' in get user ', input);
        userService.getUser(input)
            .then(resp => {
                res.statusCode = resp.http_code;
                res.json(resp.message);
            })
            .catch(err => {
                next(err);
            });
    }
}

const userRoute = new UserRoute();
app.post('/api/v1/signup', userRoute.signup);
app.post('/api/v1/login', userRoute.login);
module.exports = app;