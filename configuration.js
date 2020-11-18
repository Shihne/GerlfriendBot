config = require("./config.json");

module.exports = {
    TB: {
        name: 'tb',
        id: config.TB_id,
        confirmation: config.TB_confirmation,
        token: config.TB_token,
        v: config.TB_v,
        works: false
    },

    Wry: {
        name: 'wry',
        id: config.Wry_id,
        confirmation: config.Wry_confirmation,
        token: config.Wry_token,
        v: config.Wry_v,
        works: false
    },

    Gerlfriend: {
        name: 'gerlfriend',
        id: config.Gerlfriend_id,
        confirmation: config.Gerlfriend_confirmation,
        token: config.Gerlfriend_token,
        v: '5.126',
        works: true
    }
};