'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./bot.js');

const server = express();

const PORT = process.env.PORT || 80;

server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

server.post('/', Bot.listen);
server.listen(PORT, () => {
    Bot.setOnline();
    console.log(`Сервер работает...`);
    console.log(process.env.PORT);
});

