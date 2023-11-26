
var videoStatus = nodecg.Replicant('marathonVideoStatus');

var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
var openLives = nodecg.Replicant('StreamsOnMarathon');


var localStatus ;
var defaultStatus = {
    videos:[]
 }


 openLives.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        injectDivs(newVal)
    }
});


videoStatus.on('change', (newVal, oldVal) => {
    if(!newVal && !oldVal){
        videoStatus.value = defaultStatus;
    }
    if(newVal && newVal != oldVal){
        localStatus = newVal;
        setup(newVal);
    }
});

function injectDivs(streams){
    nodecg.readReplicant("marathonVideoStatus",'rbr', (marathonVideoStatus) => {
        localStatus = marathonVideoStatus;
        nodecg.readReplicant("runDataActiveRun",speedcontrolBundle, (newVal) => {
            var baseStatus = []; 
            console.log(streams)
            console.log(marathonVideoStatus)


            var html = ""
            var players = 0;
            newVal.teams.forEach(team=>{
                team.players.forEach(player=>{
                    var stream = streams.find((e)=>{return e.name == player.social.twitch })
                    if(stream){

                        var playerStatus = marathonVideoStatus.videos.find(e=>e.stream == player.social.twitch)
                        if (!playerStatus){
                            if(localStatus){
                                playerStatus = localStatus.videos.find(e=>e.stream == player.social.twitch)
                            }
                        }

                        if (!playerStatus){
                            playerStatus = {stream:player.social.twitch,status:"Play",volume:0.7,mute:true}
                        }
                        console.log(playerStatus)

                        html += ` <div class="audioPlayer">${player.name} (${player.social.twitch})
                        <i class="fa-regular fa-circle-play" id="play${players}" onclick="play(${players})" ${playerStatus.status != "Play"?"class='hidden'":""}></i>
                        <i class="fa-regular fa-circle-pause" id="stop${players}" onclick="stop(${players})" ${playerStatus.status == "Play"?"class='hidden'":""} ></i>
                        <i class="fa-solid fa-volume-high" id="mute${players}" onclick="mute(${players})" ${playerStatus.mute != true?"class='hidden'":""}></i>
                        <i class="fa-solid fa-volume-off" id="unmute${players}" onclick="unmute(${players})" ${playerStatus.mute == true?"class='hidden'":""}></i>
                        <input type="range" min="0" max="10" class="slider" onchange="changeVol(this,${players})" id="volume${players}">
                        <i class="fa-solid fa-refresh" id="reloadE" onclick="reload(${players})"></i>
                        </div>`;
                        html +=`<button nodecg-dialog="cropMarathon" onclick="Crop(${players})">Crop ${player.name}</button>`;
                        baseStatus.push(playerStatus)
                        console.log(baseStatus)
                    }else{

                        html += ` <div class="audioPlayer">${player.name} (${player.social.twitch}), Não tem stream Baixada </div>`;
                    }
                    players++
                })
            })
            
            document.getElementById("Players") ? document.getElementById("Players").innerHTML = html:"";
            console.log(localStatus,baseStatus)
            if (localStatus.videos != baseStatus){
                videoStatus.value = {videos:baseStatus};
            }
        });
    });
    
}

function setup(newVal){
    var player = 0;
    if(newVal.videos){
        newVal.videos.forEach(()=>{
            if(newVal.videos[player]){
                if(document.getElementById("play"+player)){
                    if(newVal.videos[player].status=="Play"){
                        document.getElementById("play"+player).classList.add("hidden");
                        document.getElementById("stop"+player).classList.remove("hidden");
                    }else{
                        document.getElementById("play"+player).classList.remove("hidden");
                        document.getElementById("stop"+player).classList.add("hidden");
                    }
                
                    if(newVal.videos[player].mute == false ){
                        unmuted = player;
                        document.getElementById("mute"+player).classList.remove("hidden");
                        document.getElementById("unmute"+player).classList.add("hidden");
                    }else{
                        document.getElementById("mute"+player).classList.add("hidden");
                        document.getElementById("unmute"+player).classList.remove("hidden");
                    }
                }
            }
            player++;
        })
    }

}

function play(index){
    var test = videoStatus.value;
    test.videos[index].status = "Play";
    videoStatus.value = test;
    document.getElementById("play"+index).classList.add("hidden");
    document.getElementById("stop"+index).classList.remove("hidden");
}

function stop(index){
    var test = videoStatus.value;
    test.videos[index].status = "Stop";
    videoStatus.value = test;
    document.getElementById("play"+index).classList.remove("hidden");
    document.getElementById("stop"+index).classList.add("hidden");
}

function mute(index){
    var test = videoStatus.value;
    test.videos[index].mute = true;
    videoStatus.value = test;
}

function unmute(index){
    var test = videoStatus.value;
    test.videos[index].mute = false;
    for(var i=0;i>test.videos.length;i++){
        if(i!=index){
            test.videos[i].mute = true;
        }
    }

    videoStatus.value = test;
}

function changeVol(input,index){
    var test = videoStatus.value;
    test.video[index].volume = input.value/10;
    videoStatus.value = test;
}

function reload(index){
    nodecg.sendMessage('ReloadVideo',{index:index});
}

var cropData = nodecg.Replicant('marathonCrop');

var defaultCrop = {
    video:[{ Game:{ x:0,y:0,h:0,w:0 }}]
 }

cropData.on('change', (newVal, oldVal) => {
    if(!newVal){
        cropData.value = defaultCrop;
    }
});

function Clear(){
    nodecg.readReplicant("runDataActiveRun",speedcontrolBundle, (dt) => {
        var res = {video:[]};
        dt.teams.forEach((team)=>{
            team.players.forEach((player)=>{
                res.video.push({Game:{x:0,y:0,h:480,w:854}})
            });
        });
        console.log(cropData,res)
        cropData.value = res;
    });
}

function Crop(index){
    nodecg.readReplicant("marathonCrop",'rbr', (dt) => {
        console.log({crop:dt,index:index})
        nodecg.sendMessage('editCropMarathon',{crop:dt,index:index});
    });
}

nodecg.listenFor('returnCrop', function (data, ack) {
    resetTimer()
});

