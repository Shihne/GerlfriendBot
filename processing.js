'use strict';

const VK_API = require('./vk_api');

const keyboards = require('./keyboards');
const models = require('./models');
const facts = require('./facts');

let e = 1;
const calls = [/^бот/i, /\sбот/i, /^падружка/i, /\sпадружка/i, /^\[club200353752\|\*bot_padruzhka]/, /^\[club200353752\|@bot_padruzhka]/];
const whoComs = ['Согласно записям в базе данных,', 'По результатам исследования,', 'Определённо,', 'Несомненно,'];
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
const secretComs = ['[[Доступ запрещён]]', '{{Данные удалены}}', 'Секретные сведения', 'Конфиденциальная информация'];

module.exports = async (group, {from_id, text, payload, peer_id, action, fwd_messages, reply_message, attachments}) => {
    switch (group.NAME) {
        case 'gerlfriend' :
            let g;
            let isConf = false;
            let isCalling;
            let database;
            let reactions = [];
            let marriageProposals = [];
            let marriages = [];
            if (peer_id > 2000000000) {

                if (peer_id === 2000000002 && action !== undefined) {
                    switch (action.type) {
                        case 'chat_kick_user' :
                            const conf = await models.Conf.findOne({
                                idVK: peer_id
                            });
                            conf.membersIds.splice(conf.membersIds.indexOf(action.member_id), 1);
                            await conf.save();
                            break;
                        case 'chat_invite_user' :
                        case 'chat_invite_user_by_link' :
                            const conf1 = await models.Conf.findOne({
                                idVK: peer_id
                            });
                            conf1.membersIds.push(action.member_id);
                            await conf1.save();
                            break;
                    }
                    break;
                }
                isConf = true;
                isCalling = calls.some(call => {

                    if (call.test(text)) {
                        let bot = text.match(call)[0];
                        let startText = text.match(call).index;
                        let endText = startText + bot.length;
                        if (text[endText + 1] === ' ')
                            endText = endText + 1;
                        text = text.slice(0, startText) + text.slice(endText);
                        return true;
                    }
                });
                //console.log(isCalling, text);
                if (!isCalling) {
                    break;
                }
                database = await models.Conf.findOne({
                    idVK: peer_id
                }).populate('marriages')
                    .populate('marriageProposals')
                    .populate('reactions');

                if (database) {
                    marriages = database.marriages;
                    marriageProposals = database.marriageProposals;
                    reactions = database.reactions;
                }
            } else {
                if (payload !== undefined)
                    g = JSON.parse(payload).button;
                database = await models.User.findOne({
                    idVK: from_id
                }).populate('reactions');
                if (database) {
                    reactions = database.reactions;
                }
            }

            if (g === '3' || /\sсписок.*\sкоманд/i.test(text)) {
                await VK_API.messagesSend(group, peer_id, `
                    Доступные команды на текущий момент. 
                    1)На сообщение со словом "таймер" и числом (в минутах или секундах) отсчитываю время;
                    2)На команды со словом "кто, кого, кому, чей, чьё, чья" выбираю участника беседы; 
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
                    14)Не всё.
                    15)Можно добавлять реакции, например "Бот добавь реакцию [кусь] [ай]".
                    16)Для удаления реакции, нужно написать, например, "Бот, удалить реакцию [кусь]".
                    17)Реакции свои для бесед и пользователя.
                    18)Продолжение следует...
                    `);
                break;
            }

            /*if (/\s[сcs][аa][ншnh]/i.test(text) || /\s[аa][лl][еe][кk][сcs][аa]/i.test(text) || /\sшурик/i.test(text)) {
                await VK_API.messagesSend(group, peer_id, secretComs[Math.floor(Math.random() * secretComs.length)]);
                break;
            }*/

            if (/назнач.*\sстатус.*\[[^\[\]]+]/i.test(text)) {
                try {
                    const s = await models.User.findOne({
                        idVK: from_id
                    });
                    if (!s || s.status !== 'G')
                        break;

                    const status = text.match(/\[[^\[\]]+]/)[0].slice(1, -1);
                    let id;
                    if (/\[id\d{9}/.test(text)) {
                        id = +text.match(/\[id\d{9}/)[0].slice(3);
                    } else if (fwd_messages.length !== 0) {
                        id = fwd_messages[0].from_id;
                    } else if (reply_message !== undefined) {
                        id = reply_message.from_id;
                    } else {
                        await VK_API.messagesSend(group, peer_id, 'Не вижу, кому надо назначить статус.');
                        break;
                    }

                    const user = await models.User.findOne({
                        idVK: id
                    });
                    if (!user) {
                        await models.User.create({
                            idVK: id,
                            status: status
                        });
                    } else {
                        user.status = status;
                        await user.save();
                    }
                    const name = await VK_API.usersGet(id, group.V, group.TOKEN, 'dat');
                    await VK_API.messagesSend(group, peer_id, `${name.first_name} ${name.last_name} назначен статус ${status}`);
                } catch (e) {
                    console.log(e);
                }
                break;
            }

            if (/список.*\sреакций/i.test(text)) {
                if (!database || reactions.length === 0) {
                    await VK_API.messagesSend(group, peer_id, `Реакций нет.`);
                } else {
                    let message = ``;
                    for (const reaction of reactions) {
                        message += `Стимул - [${reaction.stimulus}]. Ответ(ы) - [${reaction.answer}].\n`;
                    }
                    await VK_API.messagesSend(group, peer_id, message);
                }
                break;
            }

            if (/удали.*\sреакци.*\[[^\[\]]+]/i.test(text)) {
                const els = text.match(/\[[^\[\]]+]/g);
                const st = els[0].slice(1, -1);
                els.splice(0, 1);
                try {
                    if (!database || reactions.length === 0) {
                        await VK_API.messagesSend(group, peer_id, `Реакции отсутствуют.`);
                    } else {
                        let brokenReaction;
                        for (const reaction of reactions) {
                            if (reaction.stimulus === st) {
                                brokenReaction = reaction;
                                break;
                            }
                        }
                        if (brokenReaction === undefined) {
                            await VK_API.messagesSend(group, peer_id, `Реакции на такое сообщение нет.`);
                        } else {
                            if (els.length === 0) {
                                reactions.splice(reactions.indexOf(brokenReaction), 1);
                                database.reactions = reactions;
                                await database.save();
                                await models.Reaction.findByIdAndDelete(brokenReaction._id);
                                await VK_API.messagesSend(group, peer_id, `Реакция на [${st}] удалена.`);
                            } else {
                                const updReaction = await models.Reaction.findById(brokenReaction._id);
                                const answers = updReaction.answer;
                                console.log(answers);
                                console.log(els);
                                const br = [];
                                for (const answer of answers)
                                    for (const el of els) {
                                        //console.log(answer + " : " + el.slice(1, -1));
                                        if (answer === el.slice(1, -1)) {
                                            br.push(answer);
                                            //answers.splice(answers.indexOf(answer), 1);
                                        }
                                    }
                                for (const b of br)
                                    answers.splice(answers.indexOf(b), 1);
                                updReaction.answer = answers;
                                await updReaction.save();
                                await VK_API.messagesSend(group, peer_id, `Реакция обновлена.`);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                    await VK_API.messagesSend(group, peer_id, `Произошла ошибка.`);
                }
                break;
            }

            if (/добав.*\sреакци.*\[[^\[\]]+].*\[[^\[\]]+]/i.test(text) || /обнов.*\sреакци.*\[[^\[\]]+].*\[[^\[\]]+]/i.test(text)) {
                const els = text.match(/\[[^\[\]]+]/g);
                const st = els[0].slice(1, -1);
                els.splice(0, 1);
                //const an = els[1].slice(1, -1);
                const an = [];
                for (const el of els) {
                    an.push(el.slice(1, -1));
                }
                try {
                    if (!database) {
                        let newDB;
                        //let reaction;
                        if (isConf) {
                            newDB = await models.Conf.create({
                                idVK: peer_id
                            });
                        } else {
                            newDB = await models.User.create({
                                idVK: from_id
                            });
                        }
                        const reaction = await models.Reaction.create({
                            ownerID: peer_id,
                            stimulus: st,
                            answer: an
                        });
                        newDB.reactions = [reaction];
                        await newDB.save();
                        await VK_API.messagesSend(group, peer_id, `Реакция создана.`);
                    } else {
                        let existingID = '';
                        const isReacting = reactions.some(reaction => {
                            if (reaction.stimulus === st) {
                                existingID = reaction._id;
                                return true;
                            }
                        });
                        if (!isReacting) {
                            const newReaction = await models.Reaction.create({
                                ownerID: peer_id,
                                stimulus: st,
                                answer: an
                            });
                            database.reactions.push(newReaction);
                            await database.save();
                            await VK_API.messagesSend(group, peer_id, `Реакция создана.`);
                        } else {
                            const updReaction = await models.Reaction.findById(existingID);
                            for (const a of an)
                                updReaction.answer.push(a);
                            await updReaction.save();
                            await VK_API.messagesSend(group, peer_id, 'Реакция обновлена.');
                        }
                    }
                } catch (e) {
                    console.log(e);
                    await VK_API.messagesSend(group, peer_id, 'Произошла ошибка(');
                }
                break;
            }

            if (reactions.length !== 0) {
                let isDone = false;
                for (const reaction of reactions) {
                    if (text.indexOf(reaction.stimulus) !== -1) {
                        await VK_API.messagesSend(group, peer_id, reaction.answer[Math.floor(Math.random() * reaction.answer.length)]);
                        isDone = true;
                        break;
                    }
                }
                if (isDone)
                    break;
            }

            if (/добав.*\sфакт.*\[[^\[\]]+]/i.test(text)) {
                const newFacts = text.match(/\[[^\[\]]+]/g);
                try {
                    let lengthDB = await models.Fact.count();
                    let addCount = 0;
                    for (const newFact of newFacts) {
                        const existFact = await models.Fact.findOne({
                            text: newFact.slice(1, -1)
                        });
                        if (!existFact) {
                            lengthDB++;
                            addCount++;
                            await models.Fact.create({
                                number: lengthDB,
                                text: newFact.slice(1, -1),
                                author: from_id
                            });
                        } else if (existFact.isRemove) {
                            existFact.isRemove = false;
                            addCount++;
                            await existFact.save();
                        }
                    }
                    switch (addCount) {
                        case 0 :
                            await VK_API.messagesSend(group, peer_id, 'Факт(ы) уже существует(ют).');
                            break;
                        case 1:
                            await VK_API.messagesSend(group, peer_id, 'Факт добавлен.');
                            break;
                        default :
                            await VK_API.messagesSend(group, peer_id, 'Факты добавлены.');
                            break;
                    }
                    break;
                } catch (e) {
                    console.log(e);
                    break;
                }
            }

            if (/удали.*\sфакт.*\[[^\[\]]+]/i.test(text)) {
                const removeFacts = text.match(/\[[^\[\]]+]/g);
                try {
                    let deleteCount = 0;
                    for (const removeFact of removeFacts) {
                        const existFact = await models.Fact.findOneAndUpdate({
                            text: removeFact.slice(1, -1),
                            isRemove: false
                        }, {
                            isRemove: true
                        });
                        if (existFact) {
                            deleteCount++;
                        }
                    }
                    switch (deleteCount) {
                        case 0 :
                            await VK_API.messagesSend(group, peer_id, 'Факта(ов) не сущетсвует.');
                            break;
                        case 1 :
                            await VK_API.messagesSend(group, peer_id, 'Факт удалён.');
                            break;
                        default :
                            await VK_API.messagesSend(group, peer_id, 'Факты удалены.');
                            break;
                    }
                    break;
                } catch (e) {
                    console.log(e);
                    break;
                }
            }

            const sayFact = async () => {
                try {
                    const lengthDB = await models.Fact.count();
                    const i = Math.floor(Math.random() * (facts.length + lengthDB));
                    if (i >= facts.length) {
                        const dbFact = await models.Fact.findOne({
                            number: i - facts.length + 1
                        });
                        if (dbFact.isRemove)
                            return sayFact();
                        else
                            return `Факт №${dbFact.number} - ${dbFact.text}`;
                    } else {
                        return facts[i];
                    }
                } catch (e) {
                    console.log(e);
                }
            };

            if (/^факт/i.test(text) || /[^\p{Alpha}]факт/i.test(text)) {
                try {
                    const f = await sayFact();
                    await VK_API.messagesSend(group, peer_id, f);
                    break;
                } catch (e) {
                    break;
                }
            }

            const timer = time => new Promise(resolve => {
                setTimeout(resolve, time);
            });

            if (/таймер.*\d+/i.test(text) || /\d+.*таймер/i.test(text)) {
                const t = text.match(/\d/g).join('');
                const time = +JSON.parse(t);
                let y = 60000;
                let x = `мин`;
                if (/[^\p{Alpha}]сек/i.test(text) || /^сек/i.test(text)) {
                    y = 1000;
                    x = `сек`;
                }
                await VK_API.messagesSend(group, peer_id, `Таймер установлен на ${time} ${x}.`);
                await timer(time * y);
                await VK_API.messagesSend(group, peer_id, 'Время вышло.');
                if (Math.floor(Math.random()*10) === 0)
                    await VK_API.messagesSend(group, peer_id, 'Пора банить UwU');
                break;
            }

            if (/[^\p{Alpha}]вероятность/i.test(text) || /^вероятность/i.test(text)) {
                const rand = Math.floor(Math.random() * 100);
                await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + rand + '%.');
                await timer(1);
                if (text.indexOf('пидор') !== -1) {
                    await VK_API.messagesSend(group, peer_id, 'Осуждаю, кстати.');
                }
                break;
            }

            if (/[^\p{Alpha}]когда[^\p{Alpha}\p{Pd}]/i.test(text) || /^когда[^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]когда$/i.test(text) || /^когда$/i.test(text)) {
                switch (Math.floor(Math.random() * 8)) {
                    case 0 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + 'никогда.');
                        break;
                    case 1 :
                        await VK_API.messagesSend(group, peer_id, 'Неизвестно');
                        break;
                    case 2 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + todayComs[Math.floor(Math.random()*todayComs.length)]);
                        break;
                    case 3 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + weekComs[Math.floor(Math.random()*weekComs.length)]);
                        break;
                    case 4 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + monthComs[Math.floor(Math.random()*monthComs.length)]);
                        break;
                    case 5 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + yearComs[Math.floor(Math.random()*yearComs.length)]);
                        break;
                    case 6 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + decadesComs[Math.floor(Math.random()*decadesComs.length)]);
                        break;
                    case 7 :
                        await VK_API.messagesSend(group, peer_id, probComs[Math.floor(Math.random()*probComs.length)] + 'в ' + Math.floor(Math.random() * 70 + 2030) + ' году.');
                        break;
                    default :
                        await VK_API.messagesSend(group, peer_id, 'Неизвестно');
                        break;

                }
                break;
            }

            const answerWho = async (confID, name_case = 'nom') => {
                let choicen;
                if (confID !== 2000000002) {
                    const profiles = await VK_API.messagesGetConversationMembers(group, confID);
                    const rand = profiles[Math.floor(Math.random() * profiles.length)];
                    if (name_case === 'nom') {
                        choicen = {
                            first_name: rand.first_name,
                            last_name: rand.last_name
                        }
                    } else {
                        const r = await VK_API.usersGet(rand.id, group.V, group.TOKEN, name_case);
                        choicen = {
                            first_name: r.first_name,
                            last_name: r.last_name
                        }
                    }
                } else {
                    try {
                        const chID = database.membersIds[Math.floor(Math.random() * database.membersIds.length)];
                        const rand = await VK_API.usersGet(chID, group.V, group.TOKEN, name_case);
                        choicen = {
                            first_name: rand.first_name,
                            last_name: rand.last_name
                        };
                    } catch (e) {
                        console.log(e);
                    }
                }
                return choicen;
            };

            if (/[^\p{Alpha}]кто[^\p{Alpha}\p{Pd}]/i.test(text) || /^кто[^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]кто$/i.test(text) || /^кто$/i.test(text)) {
                if ((/[^\p{Alpha}]вайф/i.test(text) || /^вайф/i.test(text)) && (/[^\p{Alpha}]са[нш]/i.test(text) || /[^\p{Alpha}]алекса/i.test(text) || /^са[нш]/i.test(text) || /^алекса/i.test(text))) {
                    //const vins = await VK_API.usersGet(peer_id, group.V, group.TOKEN);
                    await VK_API.messagesSend(group, peer_id, `Никто. Отстань.`);
                    break;
                }
                if (!isConf) {
                    if (peer_id !== 541553471)
                        break;
                    else {
                        database = await models.Conf.findOne({
                            idVK: 2000000002
                        });
                        const choicen = await answerWho(2000000002);
                        await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                        break;
                    }
                }
                const choicen = await answerWho(peer_id);
                await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                break;
            }
            if (/[^\p{Alpha}]кого[^\p{Alpha}\p{Pd}]/i.test(text) || /^кого[^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]кого$/i.test(text) || /^кого$/i.test(text) ||
                /[^\p{Alpha}]чей[^\p{Alpha}\p{Pd}]/i.test(text) || /^чей[^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]чей$/i.test(text) || /^чей$/i.test(text) ||
                /[^\p{Alpha}]чь[еёя][^\p{Alpha}\p{Pd}]/i.test(text) || /^чь[еёя][^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]чь[еёя]$/i.test(text) || /^чь[еёя]$/i.test(text)) {
                if (!isConf) {
                    if (peer_id !== 541553471)
                        break;
                    else {
                        database = await models.Conf.findOne({
                            idVK: 2000000002
                        });
                        const choicen = await answerWho(2000000002, 'gen');
                        await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                        break;
                    }
                }
                const choicen = await answerWho(peer_id, 'gen');
                await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                break;
            }
            if (/[^\p{Alpha}]кому[^\p{Alpha}\p{Pd}]/i.test(text) || /^кому[^\p{Alpha}\p{Pd}]/i.test(text) || /[^\p{Alpha}]кому$/i.test(text) || /^кому$/i.test(text)) {
                if (!isConf) {
                    if (peer_id !== 541553471)
                        break;
                    else {
                        database = await models.Conf.findOne({
                            idVK: 2000000002
                        });
                        const choicen = await answerWho(2000000002, 'dat');
                        await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                        break;
                    }
                }
                const choicen = await answerWho(confID, 'dat');
                await VK_API.messagesSend(group, peer_id, `${whoComs[Math.floor(Math.random() * whoComs.length)]} ${choicen.first_name} ${choicen.last_name}.`);
                break;
            }

            if (/[^\p{Alpha}]или[^\p{Alpha}]/i.test(text)) {
                const rand = Math.floor(Math.random() * 2);
                if (rand === 0) {
                    await VK_API.messagesSend(group, peer_id, text.slice(0, text.indexOf('или')));
                } else if (rand === 1) {
                    await VK_API.messagesSend(group, peer_id, text.slice(text.indexOf('или') + 3));
                }
                await timer(1);
                if (text.indexOf('пидор') !== -1) {
                    await VK_API.messagesSend(group, peer_id, 'Осуждаю, кстати.');
                }
                break;
            }

            if (/\?/.test(text)) {
                const rand = Math.floor(Math.random() * 2);
                if (rand === 0) {
                    await VK_API.messagesSend(group, peer_id, noComs[Math.floor(Math.random()*noComs.length)]);
                } else if (rand === 1) {
                    await VK_API.messagesSend(group, peer_id, yesComs[Math.floor(Math.random()*yesComs.length)]);
                }
                await timer(1);
                if (text.indexOf('пидор') !== -1) {
                    await VK_API.messagesSend(group, peer_id, 'Осуждаю, кстати.');
                }
                break;
            }

            if (isConf && /брак.*\sпринять/i.test(text)) {
                try {
                    if (!database || marriageProposals.length === 0) {
                        await VK_API.messagesSend(group, peer_id, 'Здесь нет никаких предложений.');
                        break;
                    }
                    const proposals = marriageProposals.filter(prop => prop.bride === from_id);
                    if (proposals.length === 0) {
                        await VK_API.messagesSend(group, peer_id, 'Тебе не делали никаких предложений.');
                        break;
                    } else {
                        let groomID;
                        if (proposals.length === 1) {
                            groomID = proposals[0].groom
                        } else {
                            if (/\[id\d{9}/.test(text)) {
                                groomID = +text.match(/\[id\d{9}/)[0].slice(3);
                            } else if (fwd_messages.length !== 0) {
                                groomID = fwd_messages[0].from_id;
                            } else if (reply_message !== undefined) {
                                groomID = reply_message.from_id;
                            } else {
                                await VK_API.messagesSend(group, peer_id, 'У тебя несколько предложений брака. Пожалуйста, повтори сообщение, но добавь ссылку на конкретно того, с кем хочешь войти в брак.');
                                break;
                            }
                        }
                        const spouses = await VK_API.usersGet([groomID, from_id], group.V, group.TOKEN, 'nom', false);
                        const groom = spouses[0];
                        const bride = spouses[1];
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
                        await VK_API.messagesSend(group, peer_id, brideComs[Math.floor(Math.random() * brideComs.length)] + herComs);
                        const marriage = await models.Marriage.create({
                            conf: conf._id,
                            husband: groomID,
                            hSex: groom.sex,
                            wife: from_id,
                            wSex: bride.sex
                        });
                        database.marriages.push(marriage);
                        const rejProps = marriageProposals.filter(prop => (prop.bride === from_id || prop.bride === groomID || prop.groom === from_id || prop.groom === groomID));
                        database.marriageProposals = marriageProposals.filter(prop => (prop.bride !== from_id && prop.bride !== groomID && prop.groom !== from_id && prop.groom !== groomID));
                        await database.save();
                        rejProps.forEach(async prop => await models.MarriageProposal.findByIdAndDelete(prop._id));
                        await timer( 1);
                        await VK_API.messagesSend(group, peer_id, `*all, ${groom.first_name} и ${bride.first_name} теперь в браке!!! Поздравьте молодожёнов!`);
                    }
                } catch (e) {
                    console.log(e);
                }
                break;
            }

            if (isConf && /брак.*\sотклонить/i.test(text)) {
                try {
                    if (!database) {
                        await VK_API.messagesSend(group, peer_id, 'Здесь нет никаких предложений.');
                        break;
                    }
                    const proposals = marriageProposals.filter(prop => prop.bride === from_id);
                    if (proposals.length === 0) {
                        await VK_API.messagesSend(group, peer_id, 'Тебе не делали никаких предложений.');
                        break;
                    } else {
                        database.marriageProposals = marriageProposals.filter(prop => prop.bride !== from_id);
                        await database.save();
                        proposals.forEach(async prop => await models.MarriageProposal.findByIdAndDelete(prop._id));
                        await VK_API.messagesSend(group, peer_id, `Все предложения вам отклонены`);
                        break;
                    }
                } catch (e) {
                    console.log(e);
                }
                break;
            }

            if (isConf && /список.*\sбраков/i.test(text)) {
                let message = ``;
                try {
                    if (!database || marriages.length === 0) {
                        message = `Здесь нет браков.`;
                    } else {
                        //conf.marriages.forEach(async marriage => { ПАШОЛ НАХУЙ ФОРИЧ, ТВАРЯ ЕБАННАЯ БЛЯТЬ НЕНАВИЖУ ТЕБЯ СУКААААА
                        for (const marriage of marriages) {
                            const time = Math.floor((Date.now() - marriage.createdAt) / 86400000);
                            const spouses = await VK_API.usersGet([marriage.husband, marriage.wife], group.V, group.TOKEN, 'nom', false);
                            const husband = spouses[0];
                            const wife = spouses[1];
                            message += `${husband.first_name} ${husband.last_name} и ${wife.first_name} ${wife.last_name} - ${time} дней\n`;
                        }
                    }
                } catch (e) {
                    console.log(e);
                    message = `Не удалось связаться с базой данных. Повтори позже.`;
                }
                await VK_API.messagesSend(group, peer_id, message);
                break;

            }

            if (isConf && (/[^\p{Alpha}]развод[^\p{Alpha}]/i.test(text) || /^развод[^\p{Alpha}]/i.test(text) || /[^\p{Alpha}]развод$/i.test(text) || /^развод$/i.test(text))) {
                if (!database || marriages.length === 0) {
                    await VK_API.messagesSend(group, peer_id, `Здесь нет браков.`);
                } else {
                    let brokenMarriage;
                    for (const marriage of marriages) {
                        if (marriage.husband === from_id || marriage.wife === from_id) {
                            brokenMarriage = marriage;
                            marriages.splice(marriages.indexOf(marriage), 1);
                            break;
                        }
                    }
                    if (brokenMarriage === undefined) {
                        await VK_API.messagesSend(group, peer_id, 'Ты не в браке.');
                    } else {
                        database.marriages = marriages;
                        await database.save();
                        await models.Marriage.findByIdAndDelete(brokenMarriage._id);
                        const time = Math.floor((Date.now() - brokenMarriage.createdAt) / 86400000);
                        const spouses = await VK_API.usersGet([brokenMarriage.husband, brokenMarriage.wife], group.V, group.TOKEN, 'nom', false);
                        const husband = spouses[0];
                        const wife = spouses[1];
                        await VK_API.messagesSend(group, peer_id, `${husband.first_name} ${husband.last_name} и ${wife.first_name} ${wife.last_name} развелись после ${time} дней совместной жизни.`);
                    }
                }
                break;
            }

            if (isConf && (/[^\p{Alpha}]брак[^\p{Alpha}]/i.test(text) || /^брак[^\p{Alpha}]/i.test(text) || /[^\p{Alpha}]брак$/i.test(text) || /^брак$/i.test(text))) {
                let brideID;
                let ping = false;
                if (/\[id\d{9}/.test(text)) {
                    brideID = +text.match(/\[id\d{9}/)[0].slice(3);
                } else if (fwd_messages.length !== 0) {
                    brideID = fwd_messages[0].from_id;
                    ping = true;
                } else if (reply_message !== undefined) {
                    brideID = reply_message.from_id;
                } else if (text.indexOf('[club') !== -1) {
                    await VK_API.messagesSend(group, peer_id, 'Такие отношения аморальны вообще-то...');
                    break;
                } else {
                    await VK_API.messagesSend(group, peer_id, 'Не вижу, кого ты хочешь взять в брак.');
                    break;
                }
                let message;
                if (brideID === from_id) {
                    message = 'Извини, брачный клуб не для волков-одиночек.';
                } else if (Math.sign(brideID) === -1) {
                    message = 'Это возмутительно.';
                }
                let isMarried;
                try {
                    if (!database) {
                        const newConf = await models.Conf.create({
                            idVK: peer_id
                        });
                        const proposal = await models.MarriageProposal.create({
                            conf: newConf._id,
                            groom: from_id,
                            bride: brideID
                        });
                        newConf.marriageProposals = [proposal];
                        await newConf.save();
                        isMarried = false;
                    } else {
                        isMarried = marriages.some(marriage => (marriage.husband === brideID || marriage.wife === brideID || marriage.husband === from_id || marriage.wife === from_id));
                        const proposal = await models.MarriageProposal.findOne({
                            conf: database._id,
                            groom: from_id,
                            bride: brideID
                        });
                        if (!proposal && !isMarried) {
                            const newProposal = await models.MarriageProposal.create({
                                conf: database._id,
                                groom: from_id,
                                bride: brideID
                            });
                            database.marriageProposals.push(newProposal);
                            await database.save();
                        }
                    }
                } catch (e) {
                    console.log('Проблемы с дб');
                }
                if (isMarried === undefined) {
                    message = 'Не удалось установить связь с базой данных. Повтори позже.';
                } else if (isMarried) {
                    message = 'Это невозможно';
                } else {
                    const bride = await VK_API.usersGet(brideID, group.V, group.TOKEN);
                    if (ping) {
                        message = `[id${brideID}|${bride.first_name} ${bride.last_name}], тебе сделали предложение. Напиши в ответе слова: бот, брак, принять/отклонить.`;
                    } else {
                        message = `${bride.first_name} ${bride.last_name}, тебе сделали предложение. Напиши в ответе слова: бот, брак, принять/отклонить.`;
                    }
                }

                await VK_API.messagesSend(group, peer_id, message);
                break;
            }

            if (!isConf && from_id === 153146966 && text === 's') {
                await VK_API.messagesSend(group, from_id, "s", keyboards.gf);
                break;
            }
            if (!isConf && from_id === 153146966 && (g === "2" || text === 'Negative')) {
                if (e === 1) {
                    await VK_API.messagesSend(group, peer_id, 'Не надо это нажимать');
                } else if (e === 2) {
                    await VK_API.messagesSend(group, peer_id, 'Пожалуйста, не делай так больше');
                } else if (e === 3) {
                    await VK_API.messagesSend(group, peer_id, 'Завязывай');
                } else if (e === 4) {
                    await VK_API.messagesSend(group, peer_id, 'Да зачем здесь вообще эта тупая кнопка?');
                    e = 0;
                }
                e++;
                break;
            }
            if (!isConf && (g === "start" || text === 'Начать')) {
                await VK_API.messagesSend(group, from_id, "Добрый вечер! \nЕсли нужно ознакомиться со списком команд, но внизу нет кнопок, введи 'список команд'.", keyboards.gf1);
                break;
            }
            if (!isConf && attachments.length !== 0) {
                try {
                    const admin = await models.User.findOne({
                        idVK: from_id
                    });
                    if (!admin || admin.status !== 'G')
                        break;
                    else {
                        if (attachments[0].type === 'sticker')
                            await VK_API.messagesSend(group, from_id, attachments[0].sticker.sticker_id);
                        break;
                    }
                } catch (e) {
                    console.log(e);
                    await VK_API.messagesSend(group, from_id, 'Произошла ошибка.');
                    break;
                }
                //console.log(attachments);

            }
            if (!isConf && /^peer\d+/.test(text)) {
                try {
                    const admin = await models.User.findOne({
                        idVK: from_id
                    });
                    if (!admin || admin.status !== 'G')
                        break;
                    else {
                        const numbers = text.match(/peer\d+/)[0].slice(4);
                        const conf = +numbers + 2000000000;

                        text = text.slice(5 + numbers.length);

                        await VK_API.messagesSend(group, conf, text);
                        break;
                    }
                } catch (e) {
                    console.log(e);
                    await VK_API.messagesSend(group, from_id, 'Произошла ошибка.');
                    break;
                }
            }
            /*if (!isConf) {
                await VK_API.messagesMarkAsRead(group, id, from_id, 1);
                break;
            }*/

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