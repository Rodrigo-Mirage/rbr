var currentExtra = nodecg.Replicant('currentExtra');
var nextExtra = nodecg.Replicant('nextExtra');
var speedcontrolBundle = 'nodecg-speedcontrol';
var surronding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
var nextrunDataActiveRun = nodecg.Replicant('nextruns');
var runExtras = nodecg.Replicant('runExtras');
var localExtras;
var currentId;
var currentTrackerData = nodecg.Replicant('currentTrackerData');

runExtras.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localExtras = newVal;
    }
});

surronding.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
       // setExtras(newVal)
    }
});

currentExtra.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        currentId = newVal.id;
        set(newVal,'cur')
    }
});

nextExtra.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        set(newVal,'next')
    }
});

function setExtras(data){
    nodecg.readReplicant("currentTrackerData",'rbr', (trackerData) => {
        if(trackerData && currentId){
            if(localExtras.findIndex(e=>e.id == currentId)>-1){
                localExtras[localExtras.findIndex(e=>e.id == currentId)].trackerData = trackerData;
            }
        }
        currentExtra.value = localExtras.filter(e=>e.id == data.current)[0];
        nextExtra.value = localExtras.filter(e=>e.id == data.next)[0];
        runExtras.value = localExtras;
    });
}

function set(data , area){
    var div = document.getElementById(area == 'cur' ? "current":"next");
    var html = "";
    html += `<div class="extraInfo">
        <div class="extraInfoItem"><span>Jogo:</span> ${data.game}</div>
        <div class="extraInfoItem"><span>Tracker:</span> ${data.tracker?data.tracker:"Nenhum"}`;
        if(data.trackerData){
            html += `<span>Template Tracker:</span> ${data.trackerData.name}`;
        }
    html += `</div><div class="extraInfoItem"><span>Layout:</span> ${data.layout?data.layout:"Automatico"}</div>`;
    data.players.forEach((element,index) => {
        html +=`<div class="extraInfoPlayer">
        <fieldset><legend>Jogador ${index+1}</legend>
        <div><span>Nome:</span></div> <div>${element.name}</div><br>
        <div><span>Fonte:</span></div> <div>${element.streamType?element.streamType:"N/C"}</div><br>
        <div><span>Chave:</span></div> <div>${element.key?element.key:"N/C"}</div>
        </fieldset></div>
        `; 
    });

    html += `</div>`;

    div.innerHTML = html;
}