'use strict';

const axios = require('axios');
const httpBuildQuery = require('http-build-query');
const querystring = require('querystring');

class Request {
    static getR(methodName, params) {
        return axios.get(`https://api.vk.com/method/${methodName}?${httpBuildQuery(params)}`)
            .then(responce => responce.data)
            .catch(error => console.log(error));
    }

    static postR(methodName, params) {
        return axios.post(`https://api.vk.com/method/${methodName}`, querystring.stringify(params))
            .then(responce => console.log(responce.data))
            .catch(error => console.log(error));
    }
}

module.exports = Request;