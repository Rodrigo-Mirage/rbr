var defaultdata = {
    layout:"",
    racetime:"",
    game:"",
    title:"",
    subtitle:"",
    players:[
        { 
            name:"",
            nation:"",
            twitch:"",
            stream:"",
            avatar:""
        },
        { 
            name:"",
            nation:"",
            twitch:"",
            stream:"",
            avatar:""
        }
    ]
};
var localData;
var LayoutList = [
    {
        value : "oot",
        text : "Ocarina of Time"
    },
    {
        value : "fir",
        text : "Full-item Pokemon crystal"
    },
    {
        value : "alttp",
        text : "A link to the Past"
    },
    {
        value : "ssr",
        text : "Skyward Sword Randomizer"
    }
];

function getFlags(){
    $.ajax({
        url: "/getFlags/",
        success: (e)=>{
            NationList = e.sort((a, b)=>a.pais.localeCompare(b.pais));;
        }
    })
}
getFlags();

var single = nodecg.Replicant('singleRun');

single.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localData = newVal;
        setup(newVal);
    }
    if(!newVal && !oldVal){
        single.value = defaultdata;
    }
});

var NationList = [];

function setup(val){
    var runnerE, runnerD;
    document.getElementById('Racetime').value = val.racetime;
    document.getElementById('Game').value = val.game;
    document.getElementById('Title').value = val.title;
    document.getElementById('Subtitle').value = val.subtitle;
    
    if(val.players[0]){
        runnerE = val.players[0];
        document.getElementById('NomeE').value = runnerE.name;
        document.getElementById('TwitchE').value = runnerE.twitch;
        document.getElementById('StreamE').value = runnerE.stream;
        document.getElementById('AvatarE').value = runnerE.avatar;
    }

    if(val.players[1]){
        runnerD = val.players[1];
        document.getElementById('NomeD').value = runnerD.name;
        document.getElementById('TwitchD').value = runnerD.twitch;
        document.getElementById('StreamD').value = runnerD.stream;
        document.getElementById('AvatarD').value = runnerD.avatar;
    }
      
    nodecg.readReplicant("layouts",'rbr', (layouts) => {
        var html = `<option value="" disabled selected>Layout</option>`;
        LayoutList.forEach((item)=>{
            html += `<option value="${item.value}" ${item.value == val.layout ? "selected":""}>${item.text}</option>`;
        });
        console.log(layouts)
        if(layouts){
            layouts.forEach((item)=>{
                html += `<option value="${item.size}" ${item.size == val.layout ? "selected":""}>${item.name}</option>`;
            });
        }
        document.getElementById('Layout').innerHTML = html;    
    });


    var htmlE = `<option value="" selected >Nacionalidade</option>`;
    var htmlD = `<option value="" selected >Nacionalidade</option>`;
    if(NationList){
        NationList.forEach((nation)=>{
            if(runnerE){
                htmlE += `<option value="${nation.arquivo}" ${nation.arquivo == runnerE.nation ? "selected":""}>${nation.pais}</option>`;
            } 
            if(runnerD){
                htmlD += `<option value="${nation.arquivo}" ${nation.arquivo == runnerD.nation ? "selected":""}>${nation.pais}</option>`;
            }
        });
    }
    document.getElementById('NationE').innerHTML = htmlE;
    document.getElementById('NationD').innerHTML = htmlD;

}

function Save(){
    localData = {
        layout:document.getElementById('Layout').value,
        racetime:document.getElementById('Racetime').value,
        players:[
            { 
                name:document.getElementById('NomeE').value,
                nation:document.getElementById('NationE').value,
                twitch:document.getElementById('TwitchE').value,
                stream:document.getElementById('StreamE').value,
                avatar:document.getElementById('AvatarE').value,
                crop:{
                    x:"",
                    y:"",
                    h:"",
                    w:""
                }
            },
            { 
                name:document.getElementById('NomeD').value,
                nation:document.getElementById('NationD').value,
                twitch:document.getElementById('TwitchD').value,
                stream:document.getElementById('StreamD').value,
                avatar:document.getElementById('AvatarD').value,
                crop:{
                    x:"",
                    y:"",
                    h:"",
                    w:""
                }
            }
        ],
        game:document.getElementById('Game').value,
        title:document.getElementById('Title').value,
        subtitle:document.getElementById('Subtitle').value
    };
    single.value = localData;
}

function Clear(){
    localData.players=[
        { 
            name:"",
            nation:"",
            twitch:"",
            stream:"",
            avatar:""
        },
        { 
            name:"",
            nation:"",
            twitch:"",
            stream:"",
            avatar:""
        }
    ];
    single.value = localData;
}

function setTimer(){
    var url = localData.racetime;
    
    nodecg.sendMessage('setTimer',{"timer":-30});
}

function getRT(){
    var racetime = document.getElementById('Racetime');
    var data = {
        url:racetime.value
    }
    nodecg.sendMessage('getRT',data,(ret)=>{
        setEnt(ret.entrants);
    });
}

function setEnt(entrants){
    
    if(document.getElementById('NomeE').value){
        if(document.getElementById('NomeE').value){
            var runner = entrants.find(e=>e.user.name == document.getElementById('NomeE').value);
            if(runner){
                document.getElementById('StreamE').value = runner.user.twitch_name;
                document.getElementById('AvatarE').value = runner.user.avatar;
            }
        }
        if(document.getElementById('NomeD').value){
            var runner = entrants.find(e=>e.user.name == document.getElementById('NomeD').value);
            if(runner){
                document.getElementById('StreamD').value = runner.user.twitch_name;
                document.getElementById('AvatarD').value = runner.user.avatar;
            }          
        }
    }else{
        if(entrants.length == 2){
            var runnerE = entrants[0];
            document.getElementById('NomeE').value = runnerE.user.name;
            document.getElementById('StreamE').value = runnerE.user.twitch_name;
            document.getElementById('AvatarE').value = runnerE.user.avatar;
        
            //  avatar : "https://racetime.gg/media/Link-1.png"
            var runnerD = entrants[1];
            document.getElementById('NomeD').value = runnerD.user.name;
            document.getElementById('StreamD').value = runnerD.user.twitch_name;
            document.getElementById('AvatarD').value = runnerD.user.avatar;
        }
    }
}
