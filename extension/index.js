'use strict';

const {OBSUtility} = require('nodecg-utility-obs');
const security = require('./security');
const obsMirage = require('./obs');
const rbrTimer = require('./timer');
const discord = require('./discord');
const extraData = require('./extra');

module.exports = function (nodecg) {
    //const obs = new OBSUtility(nodecg);
    const portal = new security(nodecg);
    const obs = new obsMirage(nodecg);
    const timer = new rbrTimer(nodecg);
   // const disc = new discord(nodecg);
    const extra = new extraData(nodecg);
}

