'use strict';

const axios = require('axios');
const httpBuildQuery = require('http-build-query');

module.exports = (methodName, params) => {
    return axios.get(`https://api.vk.com/method/${methodName}?${httpBuildQuery(params)}`)
        .then(responce => responce.data)
        .catch(error => console.log(error));
};