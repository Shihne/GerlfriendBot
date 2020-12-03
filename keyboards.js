'use strict';

module.exports = {

    k1: JSON.stringify({
        one_time: false,
        buttons: [
            [
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"2\"}",
                        label: "Negative"
                    },
                    color: "negative"
                },
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"3\"}",
                        label: "Время"
                    },
                    color: "positive"
                },
            ]
        ]
    }),

    exBegin: JSON.stringify({
        one_time: true,
        buttons: [
            [
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"1\"}",
                        label: "Да"
                    },
                    color: "positive"
                },
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"2\"}",
                        label: "Нет"
                    },
                    color: "negative"
                }
            ]
        ]
    }),

    gf: JSON.stringify({
        one_time: false,
        buttons: [
            [
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"2\"}",
                        label: "Negative"
                    },
                    color: "negative"
                },
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"3\"}",
                        label: "Команды"
                    },
                    color: "positive"
                },
            ]
        ]
    }),

    gf1: JSON.stringify({
        one_time: false,
        buttons: [
            [
                {
                    action: {
                        type: "text",
                        payload: "{\"button\": \"3\"}",
                        label: "Команды"
                    },
                    color: "positive"
                },
            ]
        ]
    })

};