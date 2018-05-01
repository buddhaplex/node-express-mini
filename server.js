const express = require('express');
const helmet = require('helmet'); // yarn add helmet / then, add and require / then, use it.

// import db from './data/db';
const db = require('./data/db');

const server = express();

// add middleware
server.use(helmet());
server.use(express.json());

// route handlers

// Post
server.post('/api/users', (req, res) => {
  const userInformation = req.body;
  console.log('user information', userInformation);

  db
    .insert(userInformation)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      if (err.errno === 19) {
        res.status(400).json({ msg: 'Please provide all required fields' });
      } else {
        res.status(500).json({ error: err });
      }
    });
});

// delete user
server.delete('/api/users', function(req, res) {
  const { id } = req.query;
  let user;
  db
    .findById(id)
    .then(foundUser => {
      user = { ...foundUser[0] };

      db.remove(id).then(response => {
        res.status(200).json(user);
      });
    })   
    .catch(err => {
      res.status(500).json({ error: err });
    });
});

// PUT
server.put('/api/users/:id', function(req, res) {
  const { id } = req.params;
  const update = req.body;

  db
    .update(id, update)
    .then(count => {
      if (count > 0) {
        db.findById(id).then(users => {
          res.status(200).json(users[0]);
      });
    } else {
      res.status(404).json({ msg: 'user not found' });
    }
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

// GETS 

// Get the site to resolve at '/'
server.get('/', (req, res) => {
    res.send('Yeah, you got this Api running.');
});

// Get the users
server.get('/api/users/', (req, res) => {
  db
    .find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json({ error: err });
      // do something with the error
    });
});

// /api/users/123
server.get('/api/users/:id', (req, res) => {
  // grab id from URL parameters
  const id = req.params.id;
  
  db
    .findById(id)
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ message: 'user not found'  });
      } else {
        res.json(users[0]);
      }
   })
   .catch(err => {
     // do something with error
     res.status(500).json({ error: err });
   });
});

server.listen(5000, () => console.log('\n== API Running on port 5000\n'));
