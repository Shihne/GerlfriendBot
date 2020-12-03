'use strict';

const Determination = require('./determination');
const process = require('./processing');
const post = require('./posting');
const gett = require('./getting');

class Bot {
    static setOnline() {
        const groups = Determination.determForOnline();
        groups.forEach(async group => {
            try {
                const status = await gett('groups.getOnlineStatus', {
                    group_id: group.ID,
                    access_token: group.TOKEN,
                    v: group.V
                });
                if (status.response.status === 'none') {
                    await post('groups.enableOnline', {
                        group_id: group.ID,
                        access_token: group.TOKEN,
                        v: group.V
                    });
                } else {
                    console.log(group.NAME + ' is online');
                }
            } catch (e) {
                console.log('Проблемы с получением статуса');
            }
        });
    }

    static listen(...args) {
        const body = args[0].body;
        const group = Determination.determGroup(body.group_id);

        switch (body.type) {
            case 'confirmation' :
                args[1].end(group.CONFIRMATION);
                break;
            case 'message_new' :
                console.log(body);
                process(group, body.object.message);
                args[1].end('ok');
                break;
            default :
                console.log(body);
                args[1].end('ok');
                break;
        }
    }
}

module.exports = Bot;