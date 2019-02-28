const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

// ================================ Restricted Middleware
function restricted(req, res, next) {
	const token = req.headers.authorization;
	if (token) {
		jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
			if (err) {
				res.status(401).json({ message: "Don't tinker with the token" });
			} else {
				req.decodedJWT = decodedToken;
				next();
			}
		});
	} else {
		res.status(401).json({ message: 'You shall not pass' });
	}
}

// ================================ Check Role
function checkRole(role) {
	return function(req, res, next) {
		if (req.decodedJWT.roles && req.decodedJWT.roles.includes(role)) {
			next();
		} else {
			res.status(403).json({ message: "can't access due to role" });
		}
	};
}

module.exports = {
	restricted,
	checkRole,
};
