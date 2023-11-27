
var timerRep = nodecg.Replicant('rbr-timer');
var single = nodecg.Replicant('singleRun');
var delayVideo = nodecg.Replicant('delayVideo');

timerRep.on('change', (newVal, oldVal) => {
    if(newVal){
        document.getElementById("Timer").innerHTML = newVal.timeCalc;
    }
});

delayVideo.on('change', (newVal, oldVal) => {
    if(newVal){
        document.getElementById("delayVideo").value = newVal;
    }
});

single.on('change', (newVal, oldVal) => {
    if(newVal){

        var urlBase = "https://tracker.rbr.watch/#/manager?restream-";
        var layout = newVal.layout;
        var playerE = newVal.players[0];
        var playerD = newVal.players[1];
        if(layout && playerE.name && playerD.name){
            var url = urlBase + `${layout}=${playerE.name}${layout == 'oot'?'&restream-oot-dungeons=rbrRestream':''}${layout == 'alttp'?'&restream-alttp-dungeons=rbrRestream':''}&restream-${layout}=${playerD.name}`;
            document.getElementById("trackerLink").innerHTML = `<a target="_blank" href="${url}">${url}</a>`;
            document.getElementById("Tracker").src = url;
        }
        
    }
});

function changeDelay(input){
    delayVideo.value = input.value;
}

function start(){
    nodecg.sendMessage('rbrTimerStart');
}

function stop(){
    nodecg.sendMessage('rbrTimerStop');
}

function reset(){
    nodecg.sendMessage('rbrTimerReset');
}

function reload(){
    nodecg.sendMessage('rbrReloadRT');
}

single.on('change', (newVal, oldVal) => {
    if(newVal != oldVal){
    }
});
