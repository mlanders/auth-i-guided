const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

function generateToken(user) {
	const payload = {
		subject: user.id,
		username: user.username,
		roles: ['Student'],
	};
	const options = {
		expiresIn: '1d',
	};
	return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = { generateToken };
