
var sceneItens = nodecg.Replicant('sceneItens');
var obs = nodecg.Replicant('obs:websocket');
var obsStatus = "";

obs.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        obsStatus = newVal.status
    }
});

var itemsBaseList = [];
var itemsNextList = [];

sceneItens.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        itemsBaseList = newVal.BaseList;
        itemsNextList = newVal.NextList;
        inject();
    }
});
function reset(){        

    sceneItens.value={BaseList:[],NextList:[]};

}

function setupBase(){        
    nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemList', 'data': {
        'sceneName': 'BaseRun'
        }},(e)=>{
            console.log(e);
            itemsBaseList = [];
            e.sceneItems.forEach(element => {
                if(element.sourceName.includes('Player')){
                    var type="";
                    switch(itemsBaseList.filter(e=>e.sourceName==element.sourceName).length){
                        case 0:
                            type= "game"
                            break;
                        case 1:
                            type= "cam"
                            break;
                        case 2:
                            type= "lower"
                            break;
                        case 3:
                            type= "tracker"
                            break;
                    }
                    const item = {
                        sourceName:element.sourceName,
                        itemId:element.sceneItemId,
                        type:type
                    }
                    itemsBaseList.push(item);
                }
            });    
            inject();
        }
    );
}

function setupNext(){
    nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneItemList', 'data': {
        'sceneName': 'NextRun'
        }},(e)=>{
            itemsNextList = [];
            e.sceneItems.forEach(element => {
                var type="";
                switch(itemsNextList.filter(e=>e.sourceName==element.sourceName).length){
                    case 0:
                        type= "game"
                        break;
                    case 1:
                        type= "cam"
                        break;
                    case 2:
                        type= "lower"
                        break;
                    case 3:
                        type= "tracker"
                        break;
                }
                if(element.sourceName.includes('Player')){
                    const item = {
                        sourceName:element.sourceName,
                        itemId:element.sceneItemId,
                        type:type
                    }
                    itemsNextList.push(item);
                }
            });    
            console.log('Next:',e);
            inject();
        }
    );
}

function inject(){
    var html = "Base:<br>";
    itemsBaseList.forEach((item)=>{
        html += `${item.sourceName} (${item.type}): ${item.itemId}<br>`;
    });
    document.getElementById('BaseList').innerHTML = html;
    html = "Next:<br>";
    itemsNextList.forEach((item)=>{
        html += `${item.sourceName} (${item.type}): ${item.itemId}<br>`;
    });
    document.getElementById('NextList').innerHTML = html;

}
    
function setLists(){
    if(itemsBaseList.length > 0 && itemsNextList.length > 0){
        sceneItens.value = {
            BaseList:itemsBaseList,
            NextList:itemsNextList
        }
    }
}

var baseItens = {
    Scenes:[
        {
            name: "Setup",
            Sources:[
                {
                    name:"fundo",
                    type:"browser",
                    stats:{
                        url:"http://192.168.15.15:9090/bundles/rbr/graphics/fundo.html",
                        width:1920,
                        height:1080
                    },
                    enabled:true
                },
                {
                    name:"SetupHTML",
                    type:"browser",
                    stats:{
                        url:"http://192.168.15.15:9090/bundles/rbr/graphics/setup.html",
                        width:1920,
                        height:1080
                    },
                    enabled:true
                }
            ]
        },
        {
            name: "BaseRun",
            Sources:[
                {
                    name:"fundo",
                    type:"duplicate",
                    enabled:true
                },
                {
                    name:"Player4",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player4",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player4",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"main",
                    type:"browser",
                    stats:{
                        url:"http://192.168.15.15:9090/bundles/rbr/graphics/index.html",
                        width:1920,
                        height:1080
                    },
                    enabled:true
                },
                {
                    name:"Player4",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"arquipelago",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"blitz",
                    type:"scene",
                    enabled:false
                }
            ]
        },
        {
            name: "NextRun",
            Sources:[
                {
                    name:"fundo",
                    type:"duplicate",
                    enabled:true
                },
                {
                    name:"Player4N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player4N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player4N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"next",
                    type:"browser",
                    stats:{
                        url:"http://192.168.15.15:9090/bundles/rbr/graphics/next.html",
                        width:1920,
                        height:1080
                    },
                    enabled:true
                },
                {
                    name:"Player4N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player3N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player2N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"Player1N",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"arquipelago",
                    type:"scene",
                    enabled:false
                },
                {
                    name:"blitz",
                    type:"scene",
                    enabled:false
                }
            ]
        },
        {
            name: "arquipelago",
            Sources:[ ]
        },
        {
            name: "blitz",
            Sources:[ ]
        },
        {
            name: "Player1",
            Sources:[
                {
                    name:"Player1Browser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil2&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player1RTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player1N",
            Sources:[
                {
                    name:"Player1NBrowser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil2&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player1NRTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player2",
            Sources:[
                {
                    name:"Player2Browser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil3&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player2RTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player2N",
            Sources:[
                {
                    name:"Player2NBrowser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil3&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player2NRTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player3",
            Sources:[
                {
                    name:"Player3Browser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil4&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player3RTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player3N",
            Sources:[
                {
                    name:"Player3NBrowser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil4&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player3NRTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player4",
            Sources:[
                {
                    name:"Player4Browser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil5&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player4RTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        },
        {
            name: "Player4N",
            Sources:[
                {
                    name:"Player4NBrowser",
                    type:"browser",
                    stats:{
                        url:"https://player.twitch.tv/?channel=randobrasil5&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&volume=1",
                        width:1920,
                        height:1080
                    }
                },
                {
                    name:"Player4NRTMP",
                    type:"player",
                    stats:{
                        input: "rtmp://192.168.15.15/live/Mirage",
                        is_local_file: false
                    }
                },

            ]
        }
    ]
};

function GetInputKindList(){
    nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetInputKindList'},(ret)=>{
        ret.inputKinds.forEach((input)=>{
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetInputDefaultSettings',data:{inputKind:input}},(ret2)=>{
                console.log(input,ret2)
            });
        });
    });
}

function createCollection(){
    nodecg.sendMessage('obs:sendMessage', { 'messageName':'GetSceneCollectionList'},ret=>{
        if(ret.sceneCollections.indexOf("RBRestream")<0){
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'CreateSceneCollection',data:{sceneCollectionName:"RBRestream"}},()=>{
                nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetCurrentSceneCollection',data:{sceneCollectionName:"RBRestream"}},()=>{
                });
            });
        }else{
            nodecg.sendMessage('obs:sendMessage', { 'messageName':'SetCurrentSceneCollection',data:{sceneCollectionName:"RBRestream"}},()=>{
            });
        }
    });
}


async function createScenes(){
    var Items = JSON.parse(JSON.stringify(baseItens));
    await Items.Scenes.reverse().reduce(async (a, scene) => {
        await a;
        await nodecg.sendMessage('obs:sendMessage', { 'messageName':'CreateScene',data:{sceneName:scene.name}},()=>{
        });
        await delay(150);
    }, Promise.resolve());
    await nodecg.sendMessage('obs:sendMessage', { 'messageName':'RemoveScene',data:{sceneName:"Scene"}},()=>{
    });
}

async function createSources(){
    var Items = JSON.parse(JSON.stringify(baseItens));
    var created = []
    await Items.Scenes.reduce(async (a, scene) => {
        await a;
        //CreateScene/sceneName
        await scene.Sources.reduce(async (b, source) => {
            await b;
            var type = "";
            var configs = {};
            switch(source.type){ 
                case "browser":
                    type = "browser_source" ;
                    configs.reroute_audio = true
                    source.stats.url? configs.url = source.stats.url:"";
                    source.stats.height? configs.height = source.stats.height:"";
                    source.stats.width? configs.width = source.stats.width:"";
                    break;
                case "scene":
                    type = "scene" ;
                    break;
                case "player":
                    type = "ffmpeg_source" ;
                    configs.reroute_audio = true
                    source.stats.is_local_file? configs.is_local_file = source.stats.is_local_file:"";
                    source.stats.input? configs.input = source.stats.input:"";
                    source.stats.height? configs.height = source.stats.height:"";
                    source.stats.width? configs.width = source.stats.width:"";
                    break;
                case "duplicate":
                    type = "duplicate" ;
                    break;
            }
            switch(type){
                case "duplicate":
                    var id;
                    var origin;
                    if(created.find(e=>e.sourceName==source.name)){
                        id = created.find(e=>e.sourceName==source.name).sourceId;
                        origin = created.find(e=>e.sourceName==source.name).origin;
                    }
                    console.log(created,source.name,created.find(e=>e.sourceName==source.name),id)
                    if(id){
                        await nodecg.sendMessage('obs:sendMessage', { 'messageName':'DuplicateSceneItem',data:{
                            sceneName:origin, 
                            sceneItemId:id,
                            destinationSceneName:scene.name
                        }},()=>{
                        });
                    }
                    break;
                case "scene":
                    await nodecg.sendMessage('obs:sendMessage', { 'messageName':'CreateSceneItem',data:{
                        sceneName:scene.name, 
                        sourceName:source.name,
                        sceneItemEnabled:source.enabled
                    }},()=>{
                    });
                break;
                default:
                    await nodecg.sendMessage('obs:sendMessage', { 'messageName':'CreateInput',data:{
                        sceneName:scene.name,
                        inputName:source.name,
                        inputKind:type,
                        inputSettings:configs,
                        sceneItemEnabled:source.enabled
                    }},(ret)=>{
                        created.push({
                            sourceName:source.name,
                            sourceId:ret.sceneItemId,
                            origin:scene.name
                        });
                    });
            }
            await delay(150);
        }, Promise.resolve());
    }, Promise.resolve());
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  