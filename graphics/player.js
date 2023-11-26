
var setupInfo = nodecg.Replicant('SetupData');


setupInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setup();
    }
});

function setup(){


}

//<source src="rtmp://rbrrtmp.ddns.net/live/Mirage" type="video/webm">