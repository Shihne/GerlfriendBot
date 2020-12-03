'use strict';

const send = require('./sending');
const gett = require('./getting');

const keyboards = require('./keyboards');
const models = require('./models');

let e = 1;
const callings = ['Бот', 'бот', 'Падружка', 'падружка', '[club200353752|*bot_padruzhka]', '[club200353752|@bot_padruzhka]'];
const whoComs = ['Согласно записям в базе данных это', 'По результатам исследования это', 'Определённо это', 'Несомненно это'];
const probComs = ['По моим подсчётам ', 'Согласно полученным вычислениям ', 'Прогнозирую, что '];
const noComs = ['Нет', 'Неа', 'Сомневаюсь', 'Ну нет', 'Ответ отрицательный', 'Вряд ли'];
const yesComs = ['Да', 'Ага', 'Йеп', 'Уму', 'Определённо', 'Несомненно'];
const brideComs = ['Властью, взятой мной, ', 'Властью, взятой мной, ', 'Властью, взятой мной, ', 'Властью, дан... взятой мной, ',
    'Властью, взятой мной, ', 'Властью, взятой мной, ', 'Властью, взятой мной, ', 'Властью, взятой мной, ',];
const todayComs = ['сейчас.', 'через минуту.', 'через 2 минуты.', 'через 3 минуты.', 'через 5 минут.', 'через 10 минут.', 'через 15 минут.', 'через 20 минут.', 'через полчаса.',
    'через час.', 'через полтора часа.', 'через 2 часа.', 'через 3 часа.', 'через 5 часов.', 'через 6 часов.', 'через 10 часов.', 'сегодня.'];
const weekComs = ['завтра.', 'послезавтра.', 'через 2 дня.', 'через 3 дня.', 'через 5 дней.', 'через 4 дня.', 'через 6 дней.', 'в поннедельник.', 'во вторник.', 'в среду.',
    'в четверг', 'в пятницу', 'в субботу', 'в воскресенье', 'на этой неделе'];
const monthComs = ['на следующей неделе.', 'через 2 недели.', 'через 3 недели.', 'в этом месяце.'];
const yearComs = ['в следующем месяце.', 'через 2 месяца.', 'через 3 месяца.', 'через 5 месяцев.', 'через 4 месяца.', 'через 6 месяцев.', 'через 7 месяцев.', 'через 8 месяцев.',
    'через 9 месяцев.', 'через 10 месяцев.', 'через 11 месяцев.', 'в этом году.'];
const decadesComs = ['в следующем году.', 'через 2 года.', 'через 3 года.', 'через 4 года.', 'через 5 лет.', 'через 6 лет.', 'через 7 лет.', 'через 8 лет.', 'через 9 лет.', 'через 10 лет.'];

const messageForBride = async (id, v, token, from_id, peer_id, ping) => {
    if (id === from_id) {
        return 'Извини, брачный клуб не для волков-одиночек.';
    } else if (Math.sign(id) === -1) {
        return 'Это возмутительно.';
    }
    let isMarried;
    try {
        const conf = await models.Conf.findOne({
            idVK: peer_id
        }).populate('marriages');
        if (!conf) {
            const newConf = await models.Conf.create({
                idVK: peer_id
            });
            const proposal = await models.MarriageProposal.create({
                conf: newConf._id,
                groom: from_id,
                bride: id
            });
            newConf.marriageProposals = [proposal];
            await newConf.save();
            isMarried = false;
        } else {
            const marriages = conf.marriages;
            isMarried = marriages.some(marriage => (marriage.husband === id || marriage.wife === id || marriage.husband === from_id || marriage.wife === from_id));
            const proposal = await models.MarriageProposal.findOne({
                conf: conf._id,
                groom: from_id,
                bride: id
            });
            if (!proposal && !isMarried) {
                const newProposal = await models.MarriageProposal.create({
                    conf: conf._id,
                    groom: from_id,
                    bride: id
                });
                conf.marriageProposals.push(newProposal);
                await conf.save();
            }
        }
    } catch (e) {
        console.log('Проблемы с дб');
    }
    if (isMarried === undefined) {
        return 'Не удалось установить связь с базой данных. Повтори позже.';
    } else if (isMarried) {
        return 'Это невозможно';
    } else {
        const br = await gett('users.get', {
            user_ids: id,
            v: v,
            access_token: token
        });
        console.log(br);
        let bride;
        if (br !== undefined)
            bride = br.response[0];
        else {
            return 'Произошла ошибка доступа, не могу найти пользователя.';
        }

        if (ping) {
            return `[id${id}|${bride.first_name} ${bride.last_name}], тебе сделали предложение. Напиши в ответе слова: бот, брак, принять/отклонить.`;
        } else {
            return `${bride.first_name} ${bride.last_name}, тебе сделали предложение. Напиши в ответе слова: бот, брак, принять/отклонить.`;
        }
    }
};

module.exports = async (group, {from_id, text, payload, peer_id, action, fwd_messages, reply_message}) => {


    switch (group.NAME) {
        case 'gerlfiend' :
            let g;
            let isConf = false;
            let isCalling;
            if (JSON.stringify(peer_id).startsWith('2')) {
                isConf = true;
                isCalling = callings.some(calling => text.startsWith(calling));
            } else {
                try {
                    g = JSON.parse(payload).button;
                } catch (error) {
                    console.log('Проблема с keyboard');
                }
            }

            if (peer_id === 2000000002 && action !== undefined) {
                if (action.type === 'chat_kick_user') {
                    const conf = await models.Conf.findOne({
                        idVK: peer_id
                    });
                    conf.membersIds.splice(conf.membersIds.indexOf(action.member_id), 1);
                    await conf.save();
                } else if (action.type === 'chat_invite_user' || action.type === 'chat_invite_user_by_link') {
                    const conf = await models.Conf.findOne({
                        idVK: peer_id
                    });
                    conf.membersIds.push(action.member_id);
                    await conf.save();
                }
                break;
            }


            const canSend = !isConf || (isConf && isCalling);


            if (canSend && (g === "3" || text.indexOf('Список команд') !== -1 || text.indexOf('список команд') !== -1)) {
                await send(group, peer_id, `
                    Доступные команды на текущий момент. 
                    1)На сообщение со словом "таймер" и числом (в минутах) отсчитываю время;
                    2)На команды со словом "кто" выбираю участника беседы; 
                    3)На сообщение со словом "вероятность" выдаю число в процентах;
                    4)Если вижу слово "когда" рассчитываю предполагаемую дату;
                    5)На остальные вопросы отвечаю да или нет;
                    6)Для заключения брака надо указать слово "брак" и упомянуть свою невесту, либо ответить/переслать её сообщение;
                    7)Вообще, если предложение сделала женщина мужчине, а он соглашается, то его в браке укажут, как... а, зачем? Не надо это сюда писать!;
                    8)Чтобы согласиться на брак невеста должна написать слова "брак" и "принять/отклонить". В случаё, если у неё много женихов, придётся упомянуть/ответить/переслать кого надо.
                    9)Браки с ботами - ересь. 
                    10)А этот список не правила, поэтому не надо сюда это писать, нумерация же идёт, ааа...
                    11)Любой в браке может всегда развестись указав в своём сообщении слово "развод";
                    12)А на словосочетание "список браков" выдаётся список браков, да;
                    13)Всё.
                    `);
                break;
            }

            if ((text.indexOf('таймер') !== -1 || text.indexOf('Таймер') !== -1) && canSend) {
                const time_text = text.slice(text.indexOf('аймер'));
                const regexp = /\d/g;
                const t = time_text.match(regexp).join('');
                const time = +JSON.parse(t);
                const timer = time => new Promise(resolve => {
                    setTimeout(resolve, time);
                });
                await send(group, peer_id, 'Время установлено.');
                await timer(time * 60000);
                await send(group, peer_id, 'Время вышло.');
                if (Math.floor(Math.random()*10) === 0)
                    await send(group, peer_id, 'Пора банить UwU');
                break;
            }

            if (isConf && isCalling && (text.indexOf('кто ') !== -1 || text.indexOf('Кто ') !== -1)) {
                let choicen;
                if (peer_id !== 2000000002) {
                    const mm = await gett('messages.getConversationMembers', {
                        peer_id: peer_id,
                        group_id: group.ID,
                        access_token: group.TOKEN,
                        v: group.V
                    });
                    if (mm.error !== undefined) {
                        await send(group, peer_id, 'Нет доступа к списку участников.');
                        break;
                    }
                    const ch = mm.response.profiles[Math.floor(Math.random()*mm.response.profiles.length)];
                    choicen = {
                        first_name: ch.first_name,
                        last_name: ch.last_name
                    }
                } else {
                    try {
                        const conf = await models.Conf.findOne({
                            idVK: peer_id
                        });
                        const chID = conf.membersIds[Math.floor(Math.random()*conf.membersIds.length)];
                        const ch = await gett('users.get', {
                            user_ids: chID,
                            access_token: group.TOKEN,
                            v: group.V
                        });
                        if (ch.response === undefined) {
                            await send(group, peer_id, 'Не удалось получить имя.');
                            break;
                        }
                        const cch = ch.response[0];
                        choicen = {
                            first_name: cch.first_name,
                            last_name: cch.last_name
                        };
                    } catch (e) {
                        console.log(e);
                    }
                }
                await send(group, peer_id, `${whoComs[Math.floor(Math.random()*whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                break;
            }

            if (canSend && (text.indexOf('вероятность') !== -1 || text.indexOf('Вероятность') !== -1) &&
                text.indexOf('когда ') === -1 && text.indexOf('Когда ') === -1 &&
                text.indexOf('кто ') === -1 && text.indexOf('Кто ') === -1) {
                const rand = Math.floor(Math.random() * 100);
                await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + rand + '%.');
                if (text.indexOf('пидор') !== -1) {
                    await send(group, peer_id, 'Осуждаю, кстати.');
                }
                break;
            }

            if (canSend && (text.indexOf('когда ') !== -1 || text.indexOf('Когда ') !== -1)) {
                switch (Math.floor(Math.random() * 8)) {
                    case 0 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + 'никогда.');
                        break;
                    case 1 :
                        await send(group, peer_id, 'Неизвестно');
                        break;
                    case 2 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + todayComs[Math.floor(Math.random()*todayComs.length)]);
                        break;
                    case 3 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + weekComs[Math.floor(Math.random()*weekComs.length)]);
                        break;
                    case 4 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + monthComs[Math.floor(Math.random()*monthComs.length)]);
                        break;
                    case 5 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + yearComs[Math.floor(Math.random()*yearComs.length)]);
                        break;
                    case 6 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + decadesComs[Math.floor(Math.random()*decadesComs.length)]);
                        break;
                    case 7 :
                        await send(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + 'в ' + Math.floor(Math.random() * 70 + 2030) + ' году.');
                        break;
                    default :
                        await send(group, peer_id, 'Неизвестно');
                        break;

                }
                break;
            }


            if (canSend && text.indexOf('?') !== -1 && text.indexOf('Вероятность') === -1 && text.indexOf('вероятность') === -1 &&
                text.indexOf('когда ') === -1 && text.indexOf('Когда ') === -1) {
                const rand = Math.floor(Math.random() * 2);
                //await send(group, peer_id, rand);
                if (rand === 0) {
                    await send(group, peer_id, noComs[Math.floor(Math.random()*noComs.length)]);
                } else if (rand === 1) {
                    await send(group, peer_id, yesComs[Math.floor(Math.random()*yesComs.length)]);
                }
                if (text.indexOf('пидор') !== -1) {
                    await send(group, peer_id, 'Осуждаю, кстати.');
                }
                break;
            }

            if (isConf && isCalling && (text.indexOf('брак') !== -1 || text.indexOf('Брак') !== -1) && text.indexOf('принять') !== -1) {
                try {
                    const conf = await models.Conf.findOne({
                        idVK: peer_id
                    }).populate('marriageProposals');
                    if (!conf) {
                        await send(group, peer_id, 'Здесь нет никаких предложений.');
                        break;
                    }
                    const proposals = conf.marriageProposals.filter(prop => prop.bride === from_id);

                    if (proposals.length === 0) {
                        await send(group, peer_id, 'Тебе не делали никаких предложений.');
                        break;
                    } else {
                        let groomID;
                        if (proposals.length === 1) {
                            groomID = proposals[0].groom
                        } else {
                            const ig = text.indexOf('[id');
                            if (ig !== -1) {
                                groomID = +text.slice(ig + 3, ig + 12);
                            } else if (fwd_messages.length !== 0) {
                                groomID = fwd_messages[0].from_id;
                            } else if (reply_message !== undefined) {
                                groomID = reply_message.from_id;
                            } else {
                                await send(group, peer_id, 'У тебя несколько предложений брака. Пожалуйста, повтори сообщение, но добавь ссылку на конкретно того, с кем хочешь войти в брак.');
                                break;
                            }
                        }
                        const sp = await gett('users.get', {
                            user_ids: [groomID, from_id],
                            fields: 'sex',
                            v: group.V,
                            access_token: group.TOKEN
                        });
                        let groom, bride;
                        if (sp !== undefined) {
                            groom = sp.response[0];
                            bride = sp.response[1];
                        }
                        else {
                            await send(group, peer_id, 'Произошла ошибка доступа, не могу найти молодожёнов.');
                            break;
                        }
                        let herComs;
                        if (groom.sex === 2 && bride.sex === 1) {
                            herComs = 'я объявляю вас мужем и женой!';
                        } else if (groom.sex === 1 && bride.sex === 2) {
                            herComs = 'я объявляю вас... женой и мужем, да. Сразу ясно, кто в семье будет главным, а кто гариком...';
                        } else if (groom.sex === 1 && bride.sex === 1) {
                            herComs = 'я объявляю вас... женой и женой. Эмм, как это мило.';
                        } else if (groom.sex === 2 && bride.sex === 2) {
                            herComs = 'я объявляю вас... эээ... мужем и мужем? Ладно. Ну хотя бы не человек и бот...';
                        } else {
                            herComs = 'я объявляю вас... эээ... эммм... Кем хотите, короче.';
                        }
                        await send(group, peer_id, brideComs[Math.floor(Math.random() * brideComs.length)] + herComs);
                        const marriage = await models.Marriage.create({
                            conf: conf._id,
                            husband: groomID,
                            hSex: groom.sex,
                            wife: from_id,
                            wSex: bride.sex
                        });
                        conf.marriages.push(marriage);
                        const rejProps = conf.marriageProposals.filter(prop => (prop.bride === from_id || prop.bride === groomID || prop.groom === from_id || prop.groom === groomID));
                        conf.marriageProposals = conf.marriageProposals.filter(prop => (prop.bride !== from_id && prop.bride !== groomID && prop.groom !== from_id && prop.groom !== groomID));
                        await conf.save();
                        rejProps.forEach(async prop => await models.MarriageProposal.findByIdAndDelete(prop._id));
                        const timer = time => new Promise(resolve => {
                            setTimeout(resolve, time);
                        });
                        await timer( 1000);
                        await send(group, peer_id, `*all, ${groom.first_name} и ${bride.first_name} теперь в браке!!! Поздравьте молодожёнов!`);
                    }
                } catch (e) {
                    console.log(e);
                }
                break;
            }

            if (isConf && isCalling && (text.indexOf('брак') !== -1 || text.indexOf('Брак') !== -1) && text.indexOf('отклонить') !== -1) {
                try {
                    const conf = await models.Conf.findOne({
                        idVK: peer_id
                    }).populate('marriageProposals');
                    if (!conf) {
                        await send(group, peer_id, 'Здесь нет никаких предложений.');
                        break;
                    }
                    const proposals = conf.marriageProposals.filter(prop => prop.bride === from_id);
                    if (proposals.length === 0) {
                        await send(group, peer_id, 'Тебе не делали никаких предложений.');
                        break;
                    } else {
                        conf.marriageProposals = conf.marriageProposals.filter(prop => prop.bride !== from_id);
                        await conf.save();
                        proposals.forEach(async prop => await models.MarriageProposal.findByIdAndDelete(prop._id));
                        await send(group, peer_id, `Все предложения вам отклонены`);
                        break;
                    }
                } catch (e) {
                    console.log(e);
                }
                break;
            }

            if (isConf && isCalling && (text.indexOf('список браков') !== -1 || text.indexOf('Список браков') !== -1)) {
                let message = ``;
                try {
                    const conf = await models.Conf.findOne({
                        idVK: peer_id
                    }).populate('marriages');
                    if (!conf || conf.marriages.length === 0) {
                        message = `Здесь нет браков.`;
                    } else {
                        //conf.marriages.forEach(async marriage => { ПАШОЛ НАХУЙ ФОРИЧ, ТВАРЯ ЕБАННАЯ БЛЯТЬ НЕНАВИЖУ ТЕБЯ СУКААААА
                        for (const marriage of conf.marriages) {
                            const time = Math.floor((Date.now() - marriage.createdAt) / 86400000);
                            const sp = await gett('users.get', {
                                user_ids: [marriage.husband, marriage.wife],
                                v: group.V,
                                access_token: group.TOKEN
                            });
                            //console.log(sp);

                            if (sp === undefined) {
                                message = `Произошла ошибка со связью, не могу найти супругов.`;
                            } else {
                                const husband = sp.response[0];
                                const wife = sp.response[1];
                                message += `${husband.first_name} ${husband.last_name} и ${wife.first_name} ${wife.last_name} - ${time} дней\n`;
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                    message = `Не удалось связаться с базой данных. Повтори позже.`;
                }
                await send(group, peer_id, message);
                break;

            }

            if (isConf && isCalling && (text.indexOf('развод') !== -1 || text.indexOf('Развод') !== -1)) {
                const conf = await models.Conf.findOne({
                    idVK: peer_id
                }).populate('marriages');
                if (!conf || conf.marriages.length === 0) {
                    await send(group, peer_id, `Здесь нет браков.`);
                    break;
                } else {
                    const marriages = conf.marriages;
                    let brokenMarriage;
                    for (const marriage of marriages) {
                        if (marriage.husband === from_id || marriage.wife === from_id) {
                            brokenMarriage = marriage;
                            marriages.splice(marriages.indexOf(marriage), 1);
                            break;
                        }
                    }
                    if (brokenMarriage === undefined) {
                        await send(group, peer_id, 'Ты не в браке.');
                        break;
                    } else {
                        conf.marriages = marriages;
                        await conf.save();
                        await models.Marriage.findByIdAndDelete(brokenMarriage._id);
                        const time = Math.floor((Date.now() - brokenMarriage.createdAt) / 86400000);
                        const sp = await gett('users.get', {
                            user_ids: [brokenMarriage.husband, brokenMarriage.wife],
                            v: group.V,
                            access_token: group.TOKEN
                        });

                        if (sp === undefined) {
                            await send(group, peer_id,`Произошла ошибка со связью, не могу найти супругов.`);
                            break;
                        } else {
                            const husband = sp.response[0];
                            const wife = sp.response[1];
                            await send(group, peer_id, `${husband.first_name} ${husband.last_name} и ${wife.first_name} ${wife.last_name} развелись после ${time} дней совместной жизни.`);
                            break;
                        }
                    }
                }
            }

            if (isConf && isCalling && (text.indexOf('брак') !== -1 || text.indexOf('Брак') !== -1)) {
                const ib = text.indexOf('[id');
                if (ib !== -1) {
                    const message = await messageForBride(+text.slice(ib + 3, ib + 12), group.V, group.TOKEN, from_id, peer_id, false);
                    await send(group, peer_id, message);
                } else if (fwd_messages.length !== 0) {
                    const message = await messageForBride(fwd_messages[0].from_id, group.V, group.TOKEN, from_id, peer_id, true);
                    await send(group, peer_id, message);
                } else if (reply_message !== undefined) {
                    const message = await messageForBride(reply_message.from_id, group.V, group.TOKEN, from_id, peer_id, false);
                    await send(group, peer_id, message);
                } else if (text.indexOf('[club') !== -1) {
                    await send(group, peer_id, 'Такие отношения аморальны вообще-то...');
                    break;
                } else {
                    await send(group, peer_id, 'Не вижу, кого ты хочешь взять в брак.');
                    break;
                }
                break;
            }



            if (!isConf && from_id === 153146966 && text === 's') {
                await send(group, from_id, "s", keyboards.gf);
                break;
            }
            if (!isConf && from_id === 153146966 && (g === "2" || text === 'Negative')) {
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
            if (!isConf && (g === "start" || text === 'Начать')) {
                await send(group, from_id, "Добрый вечер! \nЕсли нужно ознакомиться со списком команд, но внизу нет кнопок, введи 'список команд'.", keyboards.gf1);
                break;
            }
            break;

        /*case 'tb' :
            let i;
            if (JSON.stringify(peer_id).startsWith('2')) {
                /*const o1 = await gett('messages.getByConversationMessageId', {
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
            await send(group, peer_id, text, keyboards.k1);
            break;
        /*case 'wry' :
            await send(group, from_id, 'Здравствуйте, начнём экскурсию с начала?', keyboards.exBegin);
            break;*/
        default :
            console.log('Не найдено');
            break;

    }

};