'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./configuration');
const Bot = require('./bot.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);
mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connection;
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true});

//server
const server = express();
server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());


server.post('/', Bot.listen);
server.listen(config.PORT, () => {
    Bot.setOnline();
    console.log(`Сервер работает на порту ${config.PORT}...`);
});

