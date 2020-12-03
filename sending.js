'use strict';

const post = require('./posting');

module.exports = ({TOKEN, V, ID}, user_id, message, keyboard) => {
    post('messages.send', {
        peer_id: user_id,
        message: message,
        access_token: TOKEN,
        random_id: 0,
        v: V,
        group_id: ID,
        keyboard
    });
};