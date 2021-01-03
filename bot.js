'use strict';

const Determination = require('./determination');
const VK_API = require('./vk_api');
const process = require('./processing');

class Bot {
    static setOnline() {
        const groups = Determination.determForOnline();
        groups.forEach(async group => {
            const status = await VK_API.groupsGetOnlineStatus(group);
            if (status === 'none') {
                await VK_API.groupsEnableOnline(group);
            } else {
                console.log(group.NAME + ', возможно, онлайн');
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