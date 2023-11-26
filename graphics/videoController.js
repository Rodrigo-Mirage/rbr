var videoStatus = nodecg.Replicant('videoStatus');

var areas = ["Game","Camera","Timer","Tracker"];

videoStatus.on('change', (newVal, oldVal) => {
areas.forEach((area)=>{
    if(newVal && newVal != oldVal){
        newVal.forEach((player,index)=>{
            var video = document.getElementById("Video"+index+area);
            if(!oldVal || player.status != oldVal[index].status){
                switch(player.status){
                    case "Play":
                        video.play();
                        break;
                    case "Stop":
                        video.pause();
                        break;
                }
            }
            if(area == "Game"){
                console.log(player)
                console.log(video)
                if(player.mute == true){
                    video.volume = 0;
                }else{
                    video.volume = player.volume;
                }
            }
        })
    }

})
});
