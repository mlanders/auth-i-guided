const express = require('express');
const configureMiddleware = require('./middleware');
const authRouter = require('../router/authRouter');
const usersRouter = require('../users/usersRouter');

const db = require('../database/dbConfig.js');
const secrets = require('../config/secrets');

const server = express();

configureMiddleware(server);

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.send('Sanity Check');
});

// protect this route, only authenticated users should see it

module.exports = server;
