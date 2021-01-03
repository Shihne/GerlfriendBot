'use strict';

const Request = require('./requesting');

class VK_API {
    static async groupsGetOnlineStatus({TOKEN, V, ID}) {
        try {
            const answer = await Request.getR('groups.getOnlineStatus', {
                group_id: ID,
                access_token: TOKEN,
                v: V
            });
            return answer.response.status;
        } catch (e) {
            console.log(e);
            return 'unknow';
        }
    }
    static async usersGet(userID, V, TOKEN, name_case = 'nom', isOne = true) {
        try {
            const answer = await Request.getR('users.get', {
                user_ids: userID,
                name_case: name_case,
                v: V,
                access_token: TOKEN
            });
            if (isOne)
                return answer.response[0];
            else
                return answer.response;
        } catch (e) {
            console.log(e);
        }
    }
    static async messagesGetConversationMembers({TOKEN, V, ID}, confID) {
        try {
            const answer = await Request.getR('messages.getConversationMembers', {
                peer_id: confID,
                group_id: ID,
                access_token: TOKEN,
                v: V
            });
            return answer.response.profiles;
        } catch (e) {
            console.log(e);
        }
    }
    static async groupsEnableOnline({TOKEN, V, ID}) {
        try {
            await Request.postR('groups.enableOnline', {
                group_id: ID,
                access_token: TOKEN,
                v: V
            });
        } catch (e) {
            console.log('Не удалось задать статус');
        }
    }
    static async messagesSend({TOKEN, V, ID}, to_id, message, keyboard) {
        try {
            await Request.postR('messages.send', {
                peer_id: to_id,
                message: message,
                access_token: TOKEN,
                random_id: 0,
                v: V,
                group_id: ID,
                keyboard
            })
        } catch (e) {
            console.log('Не удалось отправить сообщение');
        }
    }
}

module.exports = VK_API;