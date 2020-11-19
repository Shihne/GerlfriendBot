'use strict';

const send = require('./sending');
const gett = require('./getting');

const keyboards = require('./keyboards');
let e = 1;

module.exports = async (group, {from_id, text, payload, peer_id, conversation_message_id}) => {
    switch (group.name) {
        case 'gerlfriend' :
            let g;
            if (JSON.stringify(peer_id).startsWith('2')) {
                const o1 = await gett('messages.getByConversationMessageId', {
                    peer_id: peer_id,
                    conversation_message_ids: conversation_message_id,
                    access_token: group.token,
                    v: group.v
                });
                console.log(o1);
            } else {
                peer_id = from_id;
                try {
                    g = +JSON.parse(payload).button;
                } catch (error) {
                    console.log('Проблема с keyboard');
                }
            }

            if (g === 2 || text === 'Negative') {
                if (e === 1) {
                    await send(group, peer_id, 'Не надо это нажимать');
                } else if (e === 2) {
                    await send(group, peer_id, 'Пожалуйста, не делай так больше');
                } else if (e === 3) {
                    await send(group, peer_id, 'Завязывай');
                } else if (e === 4) {
                    await send(group, peer_id, 'Да зачем здесь вообще эта тупая кнопка?');
                    e = 0;
                }
                e++;
                break;
            }
            if (g === 3 || text.indexOf('Список команд') !== -1 || text.indexOf('список команд') !== -1) {
                await send(group, peer_id, `Пока только могу рассчитать какую-либо вероятность или установить таймер. \nДля первого в сообщении должно быть слово вероятность. \nДля второго - слово таймер и число минут. 
На остальные вопросы отвечаю да или нет.`);
                break;
            }
            if (text === 'Начать') {
                await send(group, peer_id, "Добрый вечер! \nЕсли нужно ознакомиться со списком команд, но внизу нет кнопок, введи 'список команд'", keyboards.gf);
                break;
            }

            if (text.indexOf('таймер') !== -1 || text.indexOf('Таймер') !== -1) {
                const time_text = text.slice(text.indexOf('аймер'));
                const regexp = /\d/g;
                const t = time_text.match(regexp).join('');
                const time = +JSON.parse(t);
                const timer = time => new Promise(resolve => {
                    setTimeout(resolve, time);
                });

                await send(group, peer_id, 'Время установлено');
                await timer(time * 60000);
                await send(group, peer_id, 'Время вышло');

                break;
            }

            if (text.indexOf('вероятность') !== -1 || text.indexOf('Вероятность') !== -1) {
                const rand = Math.floor(Math.random() * 100);
                await send(group, peer_id, 'По моим подсчётам ' + rand + '%');
                if (text.indexOf('пидор') !== -1) {
                    await send(group, peer_id, 'Осуждаю, кстати');
                }
                break;
            }


            if (text.indexOf('?') !== -1 && text.indexOf('Вероятность') === -1 && text.indexOf('вероятность') === -1) {
                const rand = Math.floor(Math.random() * 2);
                //await send(group, peer_id, rand);
                if (rand === 0) {
                    await send(group, peer_id, 'Нет');
                } else if (rand === 1) {
                    await send(group, peer_id, 'Да');
                }
                if (text.indexOf('пидор') !== -1) {
                    await send(group, peer_id, 'Осуждаю, кстати');
                }
                break;
            }

            if (text.indexOf('пидор') !== -1) {
                await send(group, peer_id, 'Осуждаю');
                break;
            }

            break;
        /*
        case 'tb' :
            let i;
            if (JSON.stringify(peer_id).startsWith('2')) {
                const o1 = await gett('messages.getByConversationMessageId', {
                    peer_id: peer_id,
                    conversation_message_ids: conversation_message_id,
                    access_token: group.token,
                    v: group.v
                });
                console.log(o1);

            } else {
                peer_id = from_id;
                try {
                    i = +JSON.parse(payload).button;
                } catch (error) {
                    console.log('Проблема с keyboard');
                }
            }


            if (i === 2 || text === 'Negative') {
                await send(group, peer_id, 'Ну ладно');
                break;
            }
            if (i === 3 ||text === 'Время' ) {
                const date = new Date();
                await send(group, peer_id, `Только что было ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`);
                break;
            }

            if (text.startsWith('Установить таймер на')) {
                const time = +JSON.parse(text.slice(21));
                const timer = time => new Promise(resolve => {
                    setTimeout(resolve, time);
                });

                await send(group, peer_id, 'Время установлено');
                await timer(time * 60000);
                await send(group, peer_id, 'Время вышло');

                break;



            }
            await send(group, from_id, text, keyboards.k1);
            break;
        /*case 'wry' :
            await send(group, from_id, 'Здравствуйте, начнём экскурсию с начала?', keyboards.exBegin);
            break;*/
        default :
            console.log('Не найдено');
            break;

    }

};