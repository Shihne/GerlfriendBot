'use strict';

const axios = require('axios');
const querystring = require('querystring');

module.exports = (methodName, params) => {
    return axios.post(`https://api.vk.com/method/${methodName}`, querystring.stringify(params))
        .then(responce => console.log(responce.data))
        .catch(error => console.log(error));
};