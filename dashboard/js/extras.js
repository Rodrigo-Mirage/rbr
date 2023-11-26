var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
var layouts = nodecg.Replicant('layouts');

var templateList = nodecg.Replicant("trackerTemplaters");

var runExtras = nodecg.Replicant('runExtras');
var editExtras = nodecg.Replicant('editExtras');

var localExtras = [];
var localEditExtras = [];
var layoutOptions = [];
var templateOptions = [];

var trackerOptions = [
    {
        name:'live',
        text:'Tracker da Live'
    },    
    {
        name:'bundle',
        text:'Tracker do Bundle'
    },
    {
        name:'planilha_blitz',
        text:'Tracker RBR Blitz'
    },
    {
        name:'planilha',
        text:'Tracker RBR Planilha'
    },
    {
        name:'arq',
        text:'Arquipelago'
    }
];

var streamTypeOptions = [
    {
        name:'rbrTwitch',
        text:'Live Rbr'
    },
    {
        name:'twitch',
        text:'Twitch'
    },
    {
        name:'rbrRTMP',
        text:'RTMP RBR'
    }
];

var rbrTwitch = [
    {
        name:'randobrasil2',
        text:'randobrasil2'
    },
    {
        name:'randobrasil3',
        text:'randobrasil3'
    },
    {
        name:'randobrasil4',
        text:'randobrasil4'
    },
    {
        name:'randobrasil5',
        text:'randobrasil5'
    },
    {
        name:'randobrasil6',
        text:'randobrasil6'
    },
    {
        name:'randobrasil7',
        text:'randobrasil7'
    },
    {
        name:'randobrasil8',
        text:'randobrasil8'
    },
];


templateList.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        templateOptions = newVal;
    }
});	
layouts.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        layoutOptions = newVal;
    }
});	


runDataArray.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        Verify(newVal);
    }
});	

function Reload (){
    nodecg.readReplicant("runDataArray", speedcontrolBundle, (value) => {
        Verify(value);
    });
}

runExtras.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localExtras = newVal;
        if(document.getElementById('GameList')){
            List(newVal)
        }
    }
});	

editExtras.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localEditExtras = newVal;
        if(document.getElementById('editExtraForm')){
            setEdit(newVal)
        } 
    }
});	

function Verify(data){
    var newExtras = [];
    data.forEach(run => {
        var plays = [];
        run.teams.forEach((team,ti)=>{
            team.players.forEach(player=>{
                plays.push({
                    team: ti,
                    name:player.name,
                    streamType:"",
                    key:""
                });
            });
        });
        newExtras.push({
            id:run.id,
            game:run.game,
            tracker: null,
            players: plays
        });
    });

    nodecg.readReplicant("runExtras", "rbr", (value) => {
        if(value){
            value.forEach(extra=>{
                var list = value.filter(e=>e.id == extra.id)
                var i = newExtras.findIndex(e=>e.id == extra.id)
                console.log(list[0])
                if(list[0]){
                    if(newExtras[i] && list[0].players && newExtras[i].players){
                        if(list[0].players.length == newExtras[i].players.length){
                            newExtras[newExtras.findIndex(e=>e.id == extra.id)] = list[0];
                        }
                    }
                }
            });
        }
        runExtras.value = newExtras;
    });
}

function List(data){
    var html = ""; 
    data.forEach(run=>{
        html += `<div class="GameListItem"  nodecg-dialog="editExtra" onClick='Edit("${run.id}")'>${run.game}</div>`;
    });
    document.getElementById('GameList').innerHTML = html;
}

function Edit(id){
    const find = localExtras.filter(e=> e.id.toString() == id.toString());
    if (find[0]){
        editExtras.value = find[0];
    }
}

function setEdit(data){
    document.getElementById('id').innerHTML = data.id;
    document.getElementById('Game').innerHTML = data.game;
    var html ="<option>Selecione</option>";
    trackerOptions.forEach((option)=>{
        html += `<option value="${option.name}" ${data.tracker == option.name? 'selected':""} >${option.text}</option>`;
    })
    document.getElementById('Tracker').innerHTML = html;
    subTracker(data)

    html ="<option>Automático</option>";
    layoutOptions.forEach((option)=>{
        html += `<option value="${option.size}" ${data.layout == option.size? 'selected':""} >${option.name}</option>`;
    })
    document.getElementById('Layout').innerHTML = html;
    html = "";

    data.players.forEach((player,index) =>{
        html += `<div class="PlayerInfo">
        <div>Time ${player.team+1}:<br><br>${player.name}</div>
        <select onChange='subSelect(this,${index})' id='streamType${index}'>
        <option>Nenhum</option>`
        streamTypeOptions.forEach((option)=>{
            html += `<option value="${option.name}" ${player.streamType == option.name? 'selected':""} >${option.text}</option>`;
        })
        html += `</select>`;

        html += `<select onChange="changeKey(this,${index})" class="${player.streamType != "rbrTwitch" ? "hidden":"" }" id='rbrStream${index}'>
        <option>Selecione</option>`
        rbrTwitch.forEach((option)=>{
            html += `<option value="${option.name}" ${player.key == option.name? 'selected':""} >${option.text}</option>`;
        })
        html += `</select>`;
        
        html += `<input onChange="changeKey(this,${index})" class="${player.streamType == "" || player.streamType == "rbrTwitch"? "hidden":"" }" type="text" id="streamKey${index}" value="${player.key}"/>`;

        html += `</div>`;
    });

    document.getElementById('Players').innerHTML = html;
}

function subTracker(data){
    var html ="";
    if(data.tracker == "bundle"){
        html+=`<select id="subTrackerEdit" onChange="subTrackerEdit(this)">`;
        html +="<option>Selecione</option>";
        templateOptions.forEach((option)=>{
            html += `<option value="${option.name}" ${data.trackerData && data.trackerData.name == option.name? 'selected':""} >${option.name}</option>`;
        })
        html+=`</select>`;
    }
    document.getElementById('SubTracker').innerHTML = html;
}

function subTrackerEdit(sel){
    var value = sel.options[sel.selectedIndex].value;
    var obj = templateOptions.find(e=>e.name == value)
    if(obj){
        localEditExtras.trackerData = obj;
        editExtras.value = localEditExtras;
    }
}

function subSelect(sel,index){
    var value = sel.options[sel.selectedIndex].value;
    document.getElementById(`rbrStream${index}`).classList = ["hidden"];
    document.getElementById(`streamKey${index}`).classList = ["hidden"];
    if(value == "rbrTwitch" ){ 
        document.getElementById(`rbrStream${index}`).classList = [];
    }
    if(value == "rbrRTMP" || value == "twitch" ){
        document.getElementById(`streamKey${index}`).classList = [];
    }
    localEditExtras.players[index].streamType = value;
    editExtras.value = localEditExtras;
}

function change(data){
    console.log(data.id)
    localEditExtras[data.id.toLowerCase()] = data.options[data.selectedIndex].value;
    editExtras.value = localEditExtras;
}

function changeKey(data,index){
    var value = "";
    if(data.options){
        value = data.options[data.selectedIndex].value;
    }else{
        value = data.value;
    }
    localEditExtras.players[index].key = value;
    editExtras.value = localEditExtras;
}

function SaveExtra(){
    if(localExtras.filter(e=>e.id.toString() == localEditExtras.id.toString()).length > 0){
        localExtras[localExtras.findIndex(e => e.id == localEditExtras.id)] = localEditExtras;
        runExtras.value = localExtras;
    }

}