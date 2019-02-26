const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./database/dbConfig.js');
const Users = require('./users/users-module.js');

const server = express();

const sessionConfig = {
	name: 'walter', // name of session cookie
	secret: process.env.SESSION_SECRET || 'this is a secret', // secret stored in .env file
	cookie: {
		maxAge: 1000 * 60 * 15, //in ms, seconds, min, hour, y
		secure: false, // used over https only
	},
	httpOnly: true, //cannot access the cookie from js using document.cookie
	resave: false, //
	saveUninitialized: false, // laws agains setting cookies automatically
	store: new KnexSessionStore({
		knex: db,
		tablename: 'sessions',
		sidfieldname: 'sid', //session id field name
		createtable: true,
		clearInterval: 1000 * 60 * 60, // in ms
	}),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
	res.send("It's alive!");
});

// ================================ Restricted Middleware
function restricted(req, res, next) {
	// let { username, password } = req.headers;

	if (req.session && req.session.username) {
		// if (username && password) {
		// Users.findBy({ username })
		// 	.first()
		// 	.then(user => {
		// 		// check that passwords match
		// 		if (user && bcrypt.compareSync(password, user.password)) {
		// 			next();
		// 		} else {
		// 			res.status(401).json({ message: 'Invalid Credentials' });
		// 		}
		// 	})
		// 	.catch(error => {
		// 		res.status(500).json({ message: 'Unexpected error' });
		// 	});
		next();
	} else {
		res.status(401).json({ message: 'You shall not pass' });
	}
}

// ================================ Register

server.post('/api/register', (req, res) => {
	let user = req.body;
	// generate hash from user's password
	const hash = bcrypt.hashSync(user.password, 16);
	// override user.password with hash
	user.password = hash;

	Users.add(user)
		.then(saved => {
			req.session.username = saved;

			res.status(201).json(saved);
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

// ================================ Login

server.post('/api/login', (req, res) => {
	let { username, password } = req.body;

	Users.findBy({ username })
		.first()
		.then(user => {
			// check that passwords match
			if (user && bcrypt.compareSync(password, user.password)) {
				req.session.username = user.username;
				res.status(200).json({ message: `Welcome ${user.username}!` });
			} else {
				res.status(401).json({ message: 'Invalid Credentials' });
			}
		})
		.catch(error => {
			res.status(500).json(error);
		});
});

// ================================ Logout
server.get('/api/logout', (req, res) => {
	if (req.session) {
		req.session.destroy(error => {
			if (error) {
				res.send('Error');
			} else {
				res.send('Successfully logged out');
			}
		});
	} else {
		res.end();
	}
});

// protect this route, only authenticated users should see it
// ================================ Users (protected)
server.get('/api/users', restricted, (req, res) => {
	Users.find()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
