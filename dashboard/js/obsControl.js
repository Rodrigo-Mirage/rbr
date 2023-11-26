var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
var timer = nodecg.Replicant('timer', speedcontrolBundle);
var nextruns = nodecg.Replicant('nextruns');
var sceneItens = nodecg.Replicant('sceneItens');

var currentExtra = nodecg.Replicant('currentExtra');
var nextExtra = nodecg.Replicant('nextExtra');
var layoutsRep = nodecg.Replicant('layouts');
var localExtra;

var obs = nodecg.Replicant('obs:websocket');
var obsStatus = "";

var RTML_url = "rtmp://192.168.15.15/live/";

obs.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        obsStatus = newVal.status
    }
});

var layouts = [];
var BKlayouts = [
    {
        name:"solo169",
        size:'s169',
        players:1,
        cameras:[
            {
                x:16,
                y:16,
                bX:307,
                bY:226
            }
        ],
        positions:[
            {
                x:360,
                y:22,
                bX:1537,
                bY:855
            }
        ],
        trackers:[
            {
                x:27,
                y:278,
                bX:291,
                bY:530
            }
        ],
        lower:[]
    },
    {
        name:"solo43",
        size:'s43',
        players:1,
        cameras:[
            {
                x:7,
                y:123,
                bX:324,
                bY:217
            }
        ],
        positions:[
            {
                x:638,
                y:17,
                bX:1265,
                bY:947
            }
        ],
        trackers:[
            {
                x:122,
                y:469,
                bX:411,
                bY:419
            }
        ],
        lower:[]
    },
    {
        name:"solo3DS",
        size:'s43',
        players:1,
        cameras:[
            {
                x:16,
                y:16,
                bX:309,
                bY:233
            }
        ],
        positions:[
            {
                x:347,
                y:21,
                bX:1542,
                bY:855
            }
        ],
        trackers:[
            {
                x:26,
                y:523,
                bX:291,
                bY:530
            }
        ],
        lower:[
            {
                x:16,
                y:244,
                bX:309,
                bY:233
            }
        ]
    },
    {
        name:"soloGBC",
        size:'s109',
        players:1,
        cameras:[
            {
                x:116,
                y:16,
                bX:461,
                bY:233
            }
        ],
        positions:[
            {
                x:738,
                y:13,
                bX:1166,
                bY:1056
            }
        ],
        trackers:[
            {
                x:122,
                y:509,
                bX:446,
                bY:430
            }
        ],
        lower:[
        ]
    },
    {
        name:"duoGBA",
        size:'s43',
        players:2,
        cameras:[],
        positions:[
            {
                x:11,
                y:85,
                bX:942,
                bY:614
            },
            {
                x:972,
                y:85,
                bX:942,
                bY:614
            }
        ],
        trackers:[
            {
                x:34,
                y:779,
                bX:654,
                bY:285
            },
            {
                x:1232,
                y:779,
                bX:654,
                bY:285
            }
        ],
        lower:[]
    },
    {
        name:"duo43",
        size:'s43',
        players:2,
        cameras:[],
        positions:[
            {
                x:11,
                y:19,
                bX:942,
                bY:699
            },
            {
                x:972,
                y:19,
                bX:942,
                bY:699
            }
        ],
        trackers:[],
        lower:[]
    },
    {
        name:"quad43",
        size:'s43',
        players:4,
        cameras:[],
        positions:[
            {
                x:5,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:5,
                y:540,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:540,
                bX:715,
                bY:535
            }
        ],
        trackers:[
            {
            x:731,
            y:110,
            bX:291,
            bY:171
            },
            {
            x:731,
            y:582,
            bX:291,
            bY:171
            },
            {
            x:904,
            y:283,
            bX:291,
            bY:171
            },
            {
            x:904,
            y:787,
            bX:291,
            bY:171
            }
        ],
        lower:[]
    },
    {
        name:"quadArquipelago",
        size:'s43',
        players:4,
        cameras:[],
        positions:[
            {
                x:5,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:5,
                y:540,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:540,
                bX:715,
                bY:535
            }
        ],
        trackers:[],
        lower:[]
    }
];

var CropDefault = {
    's169':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":261,"left":463,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's43':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":0,"left":490,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's109':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":0,"left":729,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's32':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":115,"left":462,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's3DS':{
        'cam':{'top':0,"bottom":760,"left":0,"right":1432},
        'game':{'top':0,"bottom":0,"left":506,"right":0},
        'tracker':{'top':585,"bottom":0,"left":0,"right":1436},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    }
};

layoutsRep.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        layouts = newVal;
    }
});

var itemsBaseList = [];
var itemsNextList = [];

currentExtra.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localExtra = newVal;
        setTracker(newVal,"BaseRun")
    }
});

nextExtra.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setTracker(newVal,"NextRun")
    }
});


sceneItens.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        itemsBaseList = newVal.BaseList;
        itemsNextList = newVal.NextList;
    }
});
nextruns.on('change', (newVal, oldVal) => {
    if(newVal && oldVal && newVal != oldVal){
    //if(newVal && newVal != oldVal){
       setNext(newVal);
    }
});	
runDataActiveRun.on('change', (newVal, oldVal) => {
    if(newVal && oldVal && newVal != oldVal){
    //if(newVal && newVal != oldVal){
        changeScene('Setup');
        setTimeout(()=>{setBase(newVal)},5000);
    }
});	

var runData =[];
var PlayersNum = 0;
var NextNum = 0;
var layout = [];
var nextLayout = [];

function start(){
    if(obsStatus == 'connected'){
        nodecg.sendMessage('obs:previewScene', 'BaseRun').then(() => {
            nodecg.sendMessage('obs:transition', 'Fade').then(() => {
                setTimeout(()=>{
                    nodecg.sendMessage('obs:previewScene', 'NextRun');
                },1500)
                }).catch(err => {
            });
        }).catch(err => {
        });
}
}

function setBase(newVal){
    getPlayersCount(newVal);
    layout = layouts.find((e)=>{
        return e.name == getLayout(newVal)
    })
    if(layout){
        nodecg.readReplicant("currentExtra",'rbr', (value) => {
            runData = JSON.parse(JSON.stringify(newVal));
            runData["extra"] = value;
            setScenes(runData,layout,"BaseRun");
        });
    }
    getnextruns(newVal);
}

function setNext(data){
    const newVal = data[0]
    getPlayersCount(newVal);
    nextLayout = layouts.find((e)=>{
        return e.name == getLayout(newVal)
    })
    if(nextLayout){
        nodecg.readReplicant("nextExtra",'rbr', (value) => {
            runData = JSON.parse(JSON.stringify(newVal));
            runData["extra"] = value;
            setScenes(runData,nextLayout,"NextRun");
        });
    }
}

function setScenes(newVal,data,scene){
    var source = "Player";
    for(var i=0; i<4; i++){
        var stream = getStream(newVal,i);
        setUrl(scene,source+(i+1)+(scene == 'NextRun'?"N":""),"");
    }
    for(var i=0; i<parseInt(data.players); i++){
        var stream = getStream(newVal,i);
        setPlayer(scene,source+(i+1)+(scene == 'NextRun'?"N":""),i,data.name)
        setUrl(scene,source+(i+1)+(scene == 'NextRun'?"N":""),stream,1);
        if(scene != 'NextRun'){
            copyCropToBase(source+(i+1),data.size);
        }
    }
    if(scene != 'NextRun'){
        console.log(obsStatus)
        if(obsStatus == 'connected'){
            nodecg.sendMessage('obs:previewScene', scene).then(() => {});
        }
    }
}

function copyCropToBase(source,size){
    
    if(obsStatus == 'connected'){
        var li = ['cam','game','tracker','lower'];
        li.forEach((element)=>{
            var id = getItemId(source,element);
            var idN = getItemId(source+"N",element);
            console.log('Copy '+source+": "+id+"=>"+idN)
            if(id && idN){
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemEnabled', 'data': {
                    'sceneName': 'NextRun',
                    'sceneItemId': idN,
                }},(e)=>{
                    if(e){
                        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                            'sceneName': 'BaseRun',
                            'sceneItemId': id,
                            sceneItemEnabled:e.sceneItemEnabled
                        }});
                    }
                });
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemLocked', 'data': {
                    'sceneName': 'NextRun',
                    'sceneItemId': idN,
                }},(e)=>{
                    if(e){
                        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
                            'sceneName': 'BaseRun',
                            'sceneItemId': id,
                            sceneItemLocked:e.sceneItemLocked
                        }});
                    }
                });
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemTransform', 'data': {
                    'sceneName': 'NextRun',
                    'sceneItemId': idN,
                }},(e)=>{
                    if(e){
                        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemTransform', 'data': {
                            'sceneName': 'BaseRun',
                            'sceneItemId': id,
                            sceneItemTransform:e.sceneItemTransform
                        }});
                        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemTransform', 'data': {
                            'sceneName': 'NextRun',
                            'sceneItemId': idN,
                            sceneItemTransform:{
                                cropTop:CropDefault[size][element].top,
                                cropRight:CropDefault[size][element].right,
                                cropLeft:CropDefault[size][element].left,
                                cropBottom:CropDefault[size][element].bottom,
                            }
                        }});
                    }
                });
            }
        });
    }
}

function getStream(newVal,id){
    var stream = "";
    if(newVal.extra.players[id]){
        switch(newVal.extra.players[id].streamType){
            case "rbrTwitch":
            case "twitch":
                stream = 'https://player.twitch.tv/?channel=' + newVal.extra.players[id].key + '&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1';
            break;
            case "rbrRTMP":
                stream = RTML_url + newVal.extra.players[id].key;
            break;
        }
    }
    if(stream == ""){
        var cont = 0;
        newVal.teams.forEach(team => {
            team.players.forEach(player => {
                if(cont == id){
                    stream = 'https://player.twitch.tv/?channel=' + player.social.twitch + '&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1';
                }
                cont++;
            });
        });
    }
    return stream;
}

function getPlayersCount(data){
    if(data.teams){
        PlayersNum = 0;
        for (var i = 0 ; i < data.teams.length ; i++){
            for (var j = 0 ; j < data.teams[i].players.length ; j++){
                PlayersNum++;
            }
        }
    }
}

function getNextPlayersCount(data){
    NextNum = 0;
    for (var i = 0 ; i < data.teams.length ; i++){
        for (var j = 0 ; j < data.teams[i].players.length ; j++){
            NextNum++;
        }
    }
}

function getnextruns(run) {
    nodecg.readReplicant("runDataArray", speedcontrolBundle, (value) => {
      var next5runs = [];
      var inject = false;
      for (var i = 0; i < value.length; i++) {
        if (inject) {
          next5runs.push(value[i]);
  
          if (next5runs.length == 5) {
            break;
          }
        }
        if (value[i].id == run.id) {
          inject = true;
        }
      }
      nextruns.value = next5runs;
    });
}

function getLayout(data){
    if(localExtra.layout){
        CanvasClass = localExtra.layout;
        return CanvasClass;
    }
    var CanvasClass = "";
    var layout169 = ['Wii','PC'];
    var layout43  = ['Genesis','GCN','N64','SNES','PlayStation','Dreamcast'];
    var layout3DS  = ['3DS','DS'];
    

    switch(PlayersNum){
        case 1:
            CanvasClass+="solo";
            break;
        case 2:
            CanvasClass+="duo";
            break;
        case 3:
            CanvasClass+="trio";
            break;
        case 4:
            CanvasClass+="quad";
            break;
    };
    //layout
    var sys = true;
    if(layout169.includes(data.system)){
        CanvasClass+="169";
        sys = false;
    }
    if(layout43.includes(data.system)){
        CanvasClass+="43";
        sys = false;
    }
    if(layout3DS.includes(data.system)){
        CanvasClass+="3DS";
        sys = false;
    }
    if(sys){
        CanvasClass+=data.system;
    }
    return CanvasClass;
}

function setUrl(scene, source, playerData) {
    if(obsStatus == 'connected'){
        var url = "";
        if(playerData != ""){
            url = playerData;   
            
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemId', 'data': {
                'sceneName': scene,
                'sourceName': source
            }}).then(ret=>{
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
                    'sceneName': scene,
                    'sceneItemId': ret.sceneItemId,
                    'sceneItemLocked':false
                }});             
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                    'sceneName': scene,
                    'sceneItemId': ret.sceneItemId,
                    'sceneItemEnabled':true
                }});    
            });         
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetInputSettings', 'data': {
                'inputName': source+"Browser",
                'inputSettings': {
                    'url':url
                }
            }}); 
        }
        else{    
            var li = ['cam','game','tracker','lower'];
            li.forEach((element)=>{
                var id = getItemId(source,element);
                if(id>0){
                    nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
                        'sceneName': scene,
                        'sceneItemId': id,
                        'sceneItemLocked':true
                    }});             
                    nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                        'sceneName': scene,
                        'sceneItemId': id,
                        'sceneItemEnabled':false
                    }}); 
                }
            });
        }    
}
}

function setPosition(scene,source,type,x,y,sizeX,sizeY){
    var id = getItemId(source,type);
    if(id>0){
        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
            'sceneName': scene,
            'sceneItemId': id,
            'sceneItemLocked':false
        }});             
        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
            'sceneName': scene,
            'sceneItemId': id,
            'sceneItemEnabled':true
        }});        
        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemTransform', 'data': {
            'sceneName': scene,
            'sceneItemId': id,
            sceneItemTransform:{
                boundsType:"OBS_BOUNDS_STRETCH",
                boundsHeight:sizeX,
                boundsWidth:sizeY,
                positionX:x,
                positionY:y
            }
        }});    
    }

}

function loadScenes(){
    var html = "";

    nodecg.sendMessage('obs:sendMessage', { 'messageName':"GetSceneList" }, (data)=>{
        for(var i=0; i < data.scenes.length ; i++){
            html += `<button onclick="changeScene('${data.scenes[i].name}')">${data.scenes[i].name}</button>`;
        }
        const Scenecontrol = document.getElementById("Scenecontrol");
        Scenecontrol.innerHTML = html;
    });

}

function changeScene(SceneName){
    nodecg.sendMessage('obs:previewScene', SceneName).then(() => {
        nodecg.sendMessage('obs:transition', 'Fade').then(() => {
            }).catch(err => {
        });
    }).catch(err => {
    });
}

function getItemId(source,type){
    var copyList;
    var id = 0;
    if(source.includes('N')){
        copyList = itemsNextList;
    }else{
        copyList = itemsBaseList;
    }
    if(copyList.find((e)=>{return e.sourceName == source && e.type == type})){
        id = copyList.find((e)=>{return e.sourceName == source && e.type == type}).itemId;
    }

    return id
}

function setPlayer(scene,source,position,layout){
    
    if(obsStatus == 'connected'){
        var li = ['cam','game','tracker','lower'];
        var data = layouts.find(e=>{return e.name == layout});
        if(data){
            li.forEach((element)=>{
                setTimeout(() => {
                    var id = getItemId(source,element);
                    var sizeY = 0;
                    var sizeX = 0;
                    var x = 0;
                    var y = 0;
                    var doit = false;
                    switch(element){
                        case 'cam':
                            if(data.cameras[position]){
                                doit = true;
                                sizeY = parseInt(data.cameras[position].bY);
                                sizeX = parseInt(data.cameras[position].bX);
                                x = parseInt(data.cameras[position].x);
                                y = parseInt(data.cameras[position].y);
                            }
                            break;
                        case 'game':
                            if(data.positions[position]){
                                doit = true;
                                sizeY = parseInt(data.positions[position].bY);
                                sizeX = parseInt(data.positions[position].bX);
                                x = parseInt(data.positions[position].x);
                                y = parseInt(data.positions[position].y);
                            }
                            break;
                        case 'tracker':
                            if(data.trackers[position]){
                                doit = true;
                                sizeY = parseInt(data.trackers[position].bY);
                                sizeX = parseInt(data.trackers[position].bX);
                                x = parseInt(data.trackers[position].x);
                                y = parseInt(data.trackers[position].y);
                            }
                            break;
                        case 'lower':
                            if(data.lower[position]){
                                doit = true;
                                sizeY = parseInt(data.lower[position].bY);
                                sizeX = parseInt(data.lower[position].bX);
                                x = parseInt(data.lower[position].x);
                                y = parseInt(data.lower[position].y);
                            }
                            break;
                    }
                    if(id){
                        if(doit){
                            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
                                'sceneName': scene,
                                'sceneItemId': id,
                                'sceneItemLocked':false
                            }});             
                            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                                'sceneName': scene,
                                'sceneItemId': id,
                                'sceneItemEnabled':true
                            }});        
                            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemTransform', 'data': {
                                'sceneName': scene,
                                'sceneItemId': id,
                                sceneItemTransform:{
                                    boundsType:"OBS_BOUNDS_STRETCH",
                                    boundsHeight:sizeY,
                                    boundsWidth:sizeX,
                                    positionX:x,
                                    positionY:y
                                }
                            }});        

                        }
                        else{                            
                            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                                'sceneName': scene,
                                'sceneItemId': id,
                                'sceneItemEnabled':false
                            }});                    
                            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemLocked', 'data': {
                                'sceneName': scene,
                                'sceneItemId': id,
                                'sceneItemLocked':true
                            }});
                        }
                    }
                }, 2000);
            });
        }  
}
}

function setTracker(newVal,scene){
    for(var i =0;i>PlayersNum;i++){
        setVisible(scene,"Player"+i,"Tracker",false)
    }
    setVisible(scene,"blitz" ,"",false)
    setVisible(scene,"arquipelago" ,"",false)

    switch(newVal.value){
      case "planilha_blitz":
        setVisible(scene,"blitz" ,"",true)
        break;
      case "arq":
        var players = PlayersNum/newVal.teams.length;
        var contTeam = 0;
        var contplayers = 0
        newVal.teams.forEach(team=>{
          contTeam++;
          for(var i = players ; i!=0 ; i--){
            contplayers++;
            setTrackerurl(contplayers,"https://archipelago.gg/tracker/"+team.value+"/0/"+i)
          }
        })
        setVisible(scene,"arquipelago" ,"",true)
        break;
      case "planilha":
        break;   
      case "live":
        for(var i =0;i>PlayersNum;i++){
            setVisible(scene,"Player"+i,"Tracker",true)
        }
        break;   
      default:
    }
}

function setTrackerurl(tracker,url) {
    if(obsStatus == 'connected'){
        nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSourceSettings', 'data': {
            'sceneName': 'arquipelago',
            'sourceName': 'arqTracker'+tracker,
            'sourceSettings': {
                'url':url
            }
        }}); 
    }
}

function setVisible(scene,source,element,visible){
    if(obsStatus == 'connected'){
        if(element){
            var id = getItemId(source,element);
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                'sceneName': scene,
                'sceneItemId': id,
                'sceneItemEnabled':visible
            }});
        }else{
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemId', 'data': {
                'sceneName': scene,
                'sourceName': source
            }}).then(ret=>{
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetSceneItemEnabled', 'data': {
                    'sceneName': scene,
                    'sceneItemId': ret.sceneItemId,
                    'sceneItemEnabled':visible
                }});
            });
        }
    }
}