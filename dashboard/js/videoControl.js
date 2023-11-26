
var videoStatus = nodecg.Replicant('videoStatus');

var defaultStatus = [
    {
        status:"Stop",
        mute:false,
        volume:1
    },
    {
        status:"Stop",
        mute:true,
        volume:1
    }
]

videoStatus.on('change', (newVal, oldVal) => {
    if(!newVal && !oldVal){
        videoStatus.value = defaultStatus;
    }
    if(newVal && newVal != oldVal){
        setup(newVal)
    }
});


function setDivs(data){
    var html = "";
    data.players.forEach((player,index)=>{
        html += `<div class="audioPlayer">${player.name}<br>
        <i class="fa-regular fa-circle-play" id="play${index}" onclick="play('${index}')"></i>
        <i class="fa-regular fa-circle-pause" id="stop${index}"onclick="stop('${index}')" ></i>
        <i class="fa-solid fa-volume-high" id="mute${index}" onclick="mute('${index}')"></i>
        <i class="fa-solid fa-volume-off" id="unmute${index}" onclick="unmute('${index}')"></i>
        <input type="range" min="0" max="10" class="slider" onchange="changeVol(this,'${index}')" id="volume${index}">
        <i class="fa-solid fa-refresh" id="reload${index}" onclick="reload('${index}')"></i>
        <button nodecg-dialog="crop" onclick="Crop(${index})">Crop</button><br><br>
        </div>`;
    })
    document.getElementById("videoPlayers").innerHTML = html;
}


function setup(newVal){

    nodecg.readReplicant("singleRun",'rbr', (data) => {
        setDivs(data);
        newVal.forEach((stts, index)=>{
            if(stts.status=="Play"){
                document.getElementById(`play${index}`).classList.add("hidden");
                document.getElementById(`stop${index}`).classList.remove("hidden");
            }else{
                document.getElementById(`play${index}`).classList.remove("hidden");
                document.getElementById(`stop${index}`).classList.add("hidden");
            }
        
            if(stts.mute == false ){
                document.getElementById(`mute${index}`).classList.remove("hidden");
                document.getElementById(`unmute${index}`).classList.add("hidden");
            }else{
                document.getElementById(`mute${index}`).classList.add("hidden");
                document.getElementById(`unmute${index}`).classList.remove("hidden");
            }
        
            document.getElementById(`volume${index}`).value = stts.volume*10;
        })
    });

}

function play(index){
    var test = videoStatus.value;
    test[index].status = "Play";
    videoStatus.value = test;
    document.getElementById("play"+index).classList.add("hidden");
    document.getElementById("stop"+index).classList.remove("hidden");
}

function stop(index){
    var test = videoStatus.value;
    test[index].status = "Stop";
    videoStatus.value = test;
    document.getElementById("play"+index).classList.remove("hidden");
    document.getElementById("stop"+index).classList.add("hidden");
}

function mute(index){
    var test = videoStatus.value;
    test[index].mute = true;
    videoStatus.value = test;
}

function unmute(index){
    var test = videoStatus.value;
    test[index].mute = false;
    test.forEach(element => {
        element.mute = true;
    });
    videoStatus.value = test;
}

function changeVol(input,index){
    var test = videoStatus.value;

    test[index].volume = input.value/10;
    videoStatus.value = test;
}

function reload(index){
    nodecg.sendMessage('ReloadVideo',{index:index});
}

var cropData = nodecg.Replicant('singleRunCrop');

var defaultCrop = [
    {"Game":{x:0,y:0,h:480,w:854}},
    {"Game":{x:0,y:0,h:480,w:854}},
]

cropData.on('change', (newVal, oldVal) => {
    if(!newVal){
        cropData.value = defaultCrop;
    }
});

function Clear(){
    cropData.value = defaultCrop;
}

function Crop(index){
    nodecg.readReplicant("singleRunCrop",'rbr', (cropData) => {
        nodecg.sendMessage('editCrop',{crop:cropData,index:index});
    });
}

nodecg.listenFor('returnCrop', function (data, ack) {
    resetTimer()
});
