'use strict';
const config = require('./configuration');

class Determination {
    static determGroup(id){
        switch (id) {
            case config.Wry.id :
                return config.Wry;
            case config.TB.id :
                return config.TB;
            case config.Gerlfriend.id :
                return config.Gerlfriend;
            default :
                return {};
        }
    }
    static determForOnline() {
        const groupsWorks = [];
        if (config.TB.works)
            groupsWorks.push(config.TB);
        if (config.Wry.works)
            groupsWorks.push(config.Wry);
        if (config.Gerlfriend.works)
            groupsWorks.push(config.Gerlfriend);
        return groupsWorks;
        //return [config.KLD, config.TB];
    }
}

module.exports = Determination;