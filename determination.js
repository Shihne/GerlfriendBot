'use strict';
const {GERLFRIEND, WRY, TB} = require('./configuration');

class Determination {
    static determGroup(id){
        switch (id) {
            case WRY.ID :
                return WRY;
            case TB.ID :
                return TB;
            case GERLFRIEND.ID :
                return GERLFRIEND;
            default :
                return {};
        }
    }
    static determForOnline() {
        const groupsWorks = [];
        if (TB.WORKS)
            groupsWorks.push(TB);
        if (WRY.WORKS)
            groupsWorks.push(WRY);
        if (GERLFRIEND.WORKS)
            groupsWorks.push(GERLFRIEND);
        return groupsWorks;
    }
}

module.exports = Determination;