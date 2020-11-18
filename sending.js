'use strict';

const post = require('./posting');

module.exports = ({token, v, id}, user_id, message, keyboard) => {
    post('messages.send', {
        peer_id: user_id,
        message: message,
        access_token: token,
        random_id: 0,
        v: v,
        group_id: id,
        keyboard
    });
};