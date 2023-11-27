'use strict';

const obsMirage = require('./obs');
const rbrTimer = require('./timer');
const extraData = require('./extra');

module.exports = function (nodecg) {
    const obs = new obsMirage(nodecg);
    const timer = new rbrTimer(nodecg);
    const extra = new extraData(nodecg);
}

