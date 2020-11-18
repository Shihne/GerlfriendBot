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

    /*Gerlfriend: {
        name: 'gerlfriend',
        id: 200353752,
        confirmation: '5e8d8c18',
        token: '75307a5e1cb7200faf8e46cf7fd66186f6fc64fc3643242fed448aa83277100d9e0719756d53eb8a0d3db',
        v: '5.126',
        works: true
    },*/

    Gerlfriend: {
        name: 'gerlfriend',
        id: config.Gerlfriend_id,
        confirmation: config.Gerlfriend_confirmation,
        token: config.Gerlfriend_token,
        v: '5.126',
        works: true
    }
};