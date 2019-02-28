const router = require('express').Router();
const authMiddleware = require('../auth/authMiddleware');
const Users = require('../users/users-module.js');

// ================================ Users (protected)
router.get('/', authMiddleware.restricted, authMiddleware.checkRole('Student'), (req, res) => {
	Users.find()
		.then(users => {
			res.json({ users, payload: req.decodedJWT });
		})
		.catch(err => res.send(err));
});

module.exports = router;
