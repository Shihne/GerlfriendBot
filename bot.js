'use strict';

const Determination = require('./determination');
const process = require('./processing');
const post = require('./posting');

class Bot {
    static setOnline() {
        const groups = Determination.determForOnline();
        groups.forEach(group => post('groups.enableOnline', {
            group_id: group.id,
            access_token: group.token,
            v: group.v
        }));

    }

    static listen(...args) {
        const body = args[0].body;
        const group = Determination.determGroup(body.group_id);

        switch (body.type) {
            case 'confirmation' :
                args[1].end(group.confirmation);
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