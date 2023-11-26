'use strict';

class extraData {
    constructor(nodecg){
        var speedcontrolBundle = 'nodecg-speedcontrol';

        var currentExtra = nodecg.Replicant('currentExtra');
        var nextExtra = nodecg.Replicant('nextExtra');
        var runData = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
        var runExtras = nodecg.Replicant('runExtras');

        runData.on('change', (newVal, oldVal) => {
            if(newVal != oldVal){
                var newExtra = runExtras.value.find(e=>e.id == runData.value.id);
                if(newExtra){
                    currentExtra.value = JSON.parse(JSON.stringify(newExtra));
                }
            }
        });	

        runExtras.on('change', (newVal, oldVal) => {
            if(newVal != oldVal){
                var newExtra = newVal.find(e=>e.id == currentExtra.value.id);
                if(newExtra){
                    if(JSON.stringify(newExtra) != JSON.stringify(currentExtra.value)){
                        currentExtra.value = JSON.parse(JSON.stringify(newExtra));
                    }
                }
                if(nextExtra.value){
                    var newNextExtra = newVal.find(e=>e.id == nextExtra.value.id);
                    if(newNextExtra){
                        if(JSON.stringify(newNextExtra) != JSON.stringify(nextExtra.value)){
                            nextExtra.value = JSON.parse(JSON.stringify(newNextExtra));
                        }
                    }
                }
            }
        });	
        
    }
}
module.exports = extraData;