const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
//pull in the session lib
const session = require('express-session');
//basically passing session into my KnexSessionStore
const KnexSessionStore = require('connect-session-knex')(session);//to store sessions in database

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require("../database/dbConfig.js");
const server = express();

//session config
const sessionConfig = {
//session storage options
  name: 'chocolateChip', //default would be the session id
  secret: 'keep it secret, keep it safe', //used for encryption (must be an env variable)
  saveUninitialized: true, // has implications with  GDPR laws
  resave: false,
  //how to store the sessions
  store: new KnexSessionStore({
    //DO NOT FORGET THE NEW KEYWORD
    knex, //imported db
    createTable: true,
    clearInterval: 1000*60*10,

    tablename: 'session',
    sidfieldname: 'sid',

  }),

  cookie:{
    maxAge: 1000*60*10, //10 mins in milliseconds
    secure: false, //if false the cookie is sent over http, if true only sent over https
    httpOnly: true, // if true JS cant access the cookie
  }
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig)); // will add a req.session object 


server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
