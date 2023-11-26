var currentTrackers = nodecg.Replicant('currentTrackers');
var nextTrackers = nodecg.Replicant('nextTrackers');
var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var nextrunDataActiveRun = nodecg.Replicant('nextruns');

var options = [
    {
        name:'live',
        text:'Tracker da Live'
    },
    {
        name:'planilha_blitz',
        text:'Tracker RBR Blitz'
    },
    {
        name:'planilha',
        text:'Tracker RBR'
    },
    {
        name:'arq',
        text:'Arquipelago'
    }
];

var RBRoptions = [
    {
        name:'',
        text:'Selecione'
    },
    {
        name:'OOT',
        text:'OOT'
    },
    {
        name:'ALTTP',
        text:'ALTTP'
    }
];

runDataActiveRun.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        align(newVal,'cur')
    }
});

function align(newVal){
    var count = 0;
    var firstName = "";
    var curtrack , nextrack;
    newVal.teams.forEach((team)=>{
        if(count == 0){
            firstName = team.players[0].name;
        }
        count += team.players.length;
    })
    nodecg.readReplicant("currentTrackers",'fotk', (value) => {
        if(value){
            console.log(value)
            console.log(firstName,value[0].name,count,value.length)
            if(firstName == value[0].name && count == value.length && value[0].value){
                nodecg.readReplicant("nextTrackers",'fotk', (value2) => {
                    if(value2){                
                        nodecg.readReplicant("nextruns",'fotk', (value3) => { 
                            console.log('1')
                            setup(value,'cur')  
                            setup(value2,'next')  
                        });                        
                    }else{      
                        nodecg.readReplicant("nextruns",'fotk', (value3) => {
                            console.log('2')
                            setup(value,'cur')
                            inject(value3[0],'next')
                        });
                    }
                }); 
            }else{
                nodecg.readReplicant("nextTrackers",'fotk', (value2) => {
                    if(value2 && firstName == value2[0].name){                
                        nodecg.readReplicant("nextruns",'fotk', (value3) => { 
                            console.log('3')
                            setup(value2,'cur')  
                            inject(value3[0],'next')
                        });                        
                    }else{       
                        nodecg.readReplicant("nextruns",'fotk', (value3) => {
                            console.log('4')
                            setup(value,'cur')
                            inject(value3[0],'next')
                        });
                    }
                });
            }
        }else{
            nodecg.readReplicant("nextruns",'fotk', (value3) => {
                console.log('5')
                inject(newVal,'cur')
                inject(value3[0],'next')
            });
        }
    });
}   

function reset(){
    nodecg.readReplicant("runDataActiveRun",speedcontrolBundle, (newVal) => {
        nodecg.readReplicant("nextruns",'fotk', (value3) => {
            inject(newVal,'cur')
            inject(value3[0],'next')
        });
    });
}

function setup(newVal,run){
    var element = document.getElementById('current');
    if(run == 'next'){
        element = document.getElementById('next');
    }
    var html = '';
    var cont = 0;

    newVal.forEach((player)=>{
        cont++;
        html += `<div id='${run}Player${cont}'>${player.name}</div>`;
        html += `<select id='${run}Tracker${cont}'>`;
        options.forEach((option)=>{
            html += `<option value="${option.name}"${player.value == option.name? 'selected':""} >${option.text}</option>`;
        })
        html += `</select>`;
        html += `<input type="text" id="${run}TrackerInput${cont}"/>`;
        html += `<br>`;
        console.log('setup'+run,player)
    });

    element.innerHTML = html;
    save(run)
}

function inject(newVal,run){
    var element = document.getElementById('current');
    if(run == 'next'){
        element = document.getElementById('next');
    }
    var html = '';
    var cont = 0;
    newVal.teams.forEach(team => {
        team.players.forEach((player)=>{
            cont++;
            html += `<div id='${run}Player${cont}'>${player.name}</div>`;
            html += `<select id='${run}Tracker${cont}'>`;
            options.forEach((option)=>{
                html += `<option value="${option.name}">${option.text}</option>`;
            })
            html += `</select>`;
            html += `<input type="text" id="${run}TrackerInput${cont}"/>`;
            html += `<br>`;
            console.log('inject'+run,player)
        });
    });
    element.innerHTML = html;
    save(run)
}

function save(run){
    var object = [];
    var stop = false;
    var cont = 0;
    do{
        cont++;
        var element = document.getElementById(`${run}Player${cont}`);
        var tracker = document.getElementById(`${run}Tracker${cont}`);
        if(element){
            var item = {
                name:element.innerHTML,
                value:tracker.options[tracker.selectedIndex].value
            }
            object.push(item);
        }else{
            stop = true;
        }
    }
    while(stop == false)
    switch(run){
        case 'cur':
            currentTrackers.value = object;
            break;
        case 'next':
            nextTrackers.value = object;
            break;
    }
}