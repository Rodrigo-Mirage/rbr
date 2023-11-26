
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

        var layout = newVal.layout;
        var urlBase = "https://tracker.rbr.watch/#/manager?";
        var model =  ()=>{ 
            switch(layout){
                case "oot":
                    return "zelda-"+layout;
                case "alttp":
                    return "zelda-"+layout;
                case "mmr":
                    return "zelda-"+layout;
                case "fir":
                    return "pokemon-"+layout;   
                case "sotn":
                    return "castlevania-"+layout;   
                default:
                return layout;
            }
        }
        //var playerE = newVal.players[0].name;
        //var playerD = newVal.players[1].name;

        var playerE = "player1-esquerda";
        var playerD = "player2-direita";

        if(layout && playerE && playerD){

            var url = urlBase + `${model()}=${playerE}${layout == 'oot'|| layout == 'alttp'?`&${model()}-dungeons=dungeons`:''}&${model()}=${playerD}`;
            
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
