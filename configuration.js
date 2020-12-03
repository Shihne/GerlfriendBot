const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
    /*
       ВНИМАНИЕ!

       ЛЮБЫЕ ПОСТОРОННИЕ, КОТОРЫЕ ПОПЫТАЮТСЯ
       ЗАПОЛУЧИТЬ НИЖЕ ПЕРЕЧИСЛЕННЫЕ КЛЮЧИ ДОСТУПА,
       БУДУТ НЕМЕДЛЕННО УЗНАНЫ, НАЙДЕНЫ И ЗАБРАНЫ
       ДЛЯ ИСПОЛЬЗОВАНИЯ В КАЧЕСТВЕ МАТЕРИАЛА
       В РАБОТЕ НАД [[ДАННЫЕ УДАЛЕНЫ]]

        ВЫ ПРЕДУПРЕЖДЕНЫ. НЕ ПРИСТУПАЙТЕ К ПРОСМОТРУ, ЕСЛИ
        НЕ ЯВЛЯЕТЕСЬ АВТОРИЗОВАННЫМ СОТРУДНИКОМ
     -
     -
     -
     -
     -
     -
     -
     -
     -
     -
     -
     -
     -

     --
     -
     -
     -
     -
     -
     -
     -
     --
    ТЫ ЧО, СМЕЛЫЙ БЛЯТЬ?
     -
     -
     -
     --

     -
     -
     -
     --
     -
     -
     -
     -
     -

     --
     -
     -
     -
    */

    PORT: process.env.PORT || 80,
    MONGO_URL: process.env.MONGO_URL,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    TB: {
        NAME: 'tb',
        ID: process.env.TB_ID,
        CONFIRMATION: process.env.TB_CONFIRMATION,
        TOKEN: process.env.TB_TOKEN,
        V: '5.126',
        WORKS: false
    },

    WRY: {
        NAME: 'wry',
        ID: process.env.WRY_ID,
        CONFIRMATION: process.env.WRY_CONFIRMATION,
        TOKEN: process.env.WRY_TOKEN,
        V: '5.126',
        WORKS: false
    },

    GERLFRIEND: {
        NAME: 'gerlfriend',
        ID: process.env.GERLFRIEND_ID,
        CONFIRMATION: process.env.GERLFRIEND_CONFIRMATION,
        TOKEN: process.env.GERLFRIEND_TOKEN,
        V: '5.126',
        WORKS: true
    }
};