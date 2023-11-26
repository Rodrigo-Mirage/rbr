
var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);

var obsSettings = nodecg.Replicant('obs:websocket');
obsSettings.on('change', (newVal, oldVal) => {
    loadScenes()
    if(newVal.status != "connected"){
        connected = false;
    }else{
        connected = true;
    }
    console.log(newVal)
});		

var connected = true;

function loadScenes(){
    var html = "";
    if(connected){
        nodecg.sendMessage('obs:sendMessage', { 'messageName':"GetSceneList" }, async (data)=>{
            var reorder = data.scenes.sort((a,b)=>{
                let fa = a.sceneName.toLowerCase(),
                fb = b.sceneName .toLowerCase();
        
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
            })
            reorder.forEach(scene=>{
                html += `<button onclick="changeScene('${scene.sceneName}')" style='display: block;width: 100%'>${scene.sceneName}</button>`;
            })
            const Scenecontrol = document.getElementById("Scenecontrol");
            Scenecontrol.innerHTML = html;
        });
    }else{
        const Scenecontrol = document.getElementById("Scenecontrol");
        Scenecontrol.innerHTML = "";
    }

}

function changeScene(SceneName){
    nodecg.sendMessage('obs:previewScene', SceneName).then(() => {
        nodecg.sendMessage('obs:transition', 'Fade').then(() => {
            }).catch(err => {
        });
    }).catch(err => {
    });
}

function start(){

    nodecg.sendMessage('obs:sendMessage', { 'messageName':"StartStream" }, async (data)=>{
    })

}

function stop(){
    
    nodecg.sendMessage('obs:sendMessage', { 'messageName':"StopStream" }, async (data)=>{
    })
}

runDataActiveRun.on('change', (newVal, oldVal) => {
    if(newVal && oldVal && newVal != oldVal){
    //if(newVal && newVal != oldVal){
        changeScene('setupMarathon');
    }
});	