var localData;

var single = nodecg.Replicant('singleRun');
var timerReplicant = nodecg.Replicant('rbr-timer');
var sponsors = nodecg.Replicant('assets:sponsors');
var loop = true;
var sponsorsList = true;
var layout ="";
var videoUrls = ["",""];
var CanvasClass = "";

var areas = ["Game","Camera","Timer","Tracker"];

var cropData = nodecg.Replicant('singleRunCrop');

var cropDataLocal; 
cropData.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){    
        cropDataLocal = newVal;
        if(document.getElementById('videos')){
            crop(newVal);
        }
    }
});

sponsors.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        sponsorsList = newVal;
    }
});

timerReplicant.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        var timer = document.getElementById('timer');
        if(timer){
            timer.innerHTML = newVal.timeCalc;
        }
    }
});

single.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){

        localData = newVal;
        createDivs(newVal)
        setup(newVal);
    }
});

function setup(val){

    layout = val.layout;
    CanvasClass = layout;
    var res = ()=>{ 
        switch(layout){
            case "oot":
            case "alttp":
            return "s46";
            case "fir":
            return "s910";       
            default:
            return "base";
        }
    }
    document.body.classList=[];
    
    if(document.getElementById('front')){
        document.body.classList.add(val.layout);
        document.body.classList.add(res());
    }

    //var urlBase = "https://dev.tracker.rbr.watch/#/restream-";
    var urlBase = "https://tracker.rbr.watch/#/";
    var model =  ()=>{ 
        switch(layout){
            case "oot":
                return "zelda-"+layout;
            case "alttp":
                return "zelda-"+layout;
            case "mmr":
                return "zelda-"+layout;
            case "fir":
                return "pokemon-"+layout;   
            case "sotn":
                return "castlevania-"+layout;   
            default:
            return layout;
        }
    }

    val.players.forEach((player,index)=>{

        if(document.getElementById('Nome'+index)){
            document.getElementById('Nome'+index).innerHTML = player.name;
        }
        if(document.getElementById('Nation'+index)){
            document.getElementById('Nation'+index).src = "./img/flags/"+player.nation;
        }
        if(document.getElementById('Twitch'+index)){
            document.getElementById('Twitch'+index).innerHTML = showstream(player);
            searchVideo(player.stream,index);
        }
        if(document.getElementById('ResultTwitch'+index)){
            document.getElementById('ResultTwitch'+index).innerHTML = "twitch.tv/"+(player.twitch || player.stream);
        }
        if(document.getElementById('Avatar'+index)){
            document.getElementById('Avatar'+index).src = player.avatar;
        }
        if(layout && document.getElementById('Tracker'+index+'Div')){
            //document.getElementById('TrackerE').src = `${urlBase}${model}/view/${playerE.name}`;
            var url = `${urlBase}${model()}/view/${index==0?"player1-esquerda":"player2-direita"}`;
            document.getElementById('Tracker'+index+'Div').innerHTML = `<iframe id="Tracker${index}" src="${url}" allowtransparency = "true"></iframe>`;
        }
    
    })

    if(document.getElementById('TitleDiv')){
        document.getElementById('game').innerHTML = val.game;
        document.getElementById('title').innerHTML = val.title;
        document.getElementById('subtitle').innerHTML = val.subtitle;
    }
    if(document.getElementById('front')){
        document.getElementById('game').style.fontSize = getFontSize(document.getElementById('game').textContent.length,2,30);
        document.getElementById('title').style.fontSize = getFontSize(document.getElementById('title').textContent.length,2,30);
        document.getElementById('subtitle').style.fontSize = getFontSize(document.getElementById('subtitle').textContent.length,1,15);
    }
    if(document.getElementById('starting')){
        document.getElementById('game').style.fontSize = getFontSize(document.getElementById('game').textContent.length,5,60);
        document.getElementById('title').style.fontSize = getFontSize(document.getElementById('title').textContent.length,4,60);
        document.getElementById('subtitle').style.fontSize = getFontSize(document.getElementById('subtitle').textContent.length,2,30);
    }
    if(document.getElementById('finish')){
        document.getElementById('game').style.fontSize = getFontSize(document.getElementById('game').textContent.length,5,55);
        document.getElementById('title').style.fontSize = getFontSize(document.getElementById('title').textContent.length,4,35);
        document.getElementById('subtitle').style.fontSize = getFontSize(document.getElementById('subtitle').textContent.length,2,20);
    }
    var prices = "";
    switch(layout){
        case "oot":
            prices = `${urlBase}zelda-oot-dungeons/view/dungeons`;
            //prices = `https://usina.spidium.live/develop-rbr-tracker/#/restream-oot-dungeons/view/rbrRestream`;
            break;
        case "alttp":
            //prices = `${urlBase}${layout}-dungeons/view/rbrRestream`;
            prices = `https://tracker.rbr.watch/#/zelda-alttp-dungeons/view/dungeons`;
            break;
    }
    if(document.getElementById('TrackerPricesDiv')){

        document.getElementById('TrackerPricesDiv').innerHTML = `<iframe id="TrackerPrices" src ="${prices}"allowtransparency = "true"></iframe>`;
    }
    
    if(document.getElementById('videos')){
        nodecg.readReplicant("singleRunCrop",'rbr', (run) => {
            crop(run)
        });
    }

}

function showstream(player){
    var text = "";

    if(!player.twitch && player.twitch != player.name){
        text = player.twitch;
    }

    return text;
}

function searchVideo(player,index){
    nodecg.readReplicant("videoStatus",'rbr', (status) => {
        nodecg.readReplicant("StreamsOn",'rbr', (localLives) => {
            console.log(localLives)
            var lives = localLives.filter(e=>{return e.name == player});
            if(lives[0]){
                var url = `/video/rbr/${lives[0].name}|${lives[0].quality}.m3u8`;
                videoUrls[index] = url;
                areas.forEach((area)=>{
                    if(cropDataLocal[index][area] && cropDataLocal[index][area].x != null){
                        setvideo(url,"Video"+index+area , area== "Game" ? status[index].mute == true?0:status[index].volume:0);
                        if(area == "Tracker"){
                            if(document.getElementById("Tracker"+index+"Div")){
                                document.getElementById("Tracker"+index+"Div").classList.add("hidden")
                            }
                        }
                    }
                    else{                        
                        if(area == "Tracker"){
                            if(document.getElementById("Tracker"+index+"Div")){
                                document.getElementById("Tracker"+index+"Div").classList.remove("hidden")
                            }
                        }
                    }
                })
            }
        });
    });
}

function spinerSponsors(index){
    if(document.getElementById('sponsor1')){
        nodecg.readReplicant("assets:sponsors",'rbr', (localLives) => {
            if (localLives.length > 0){
                if(index >= localLives.length){
                    index = 0;
                }

                console.log(localLives[index]);
                var Iin,Iout;
                if(document.getElementById('sponsor1').className == "hidden" || document.getElementById('sponsor1').className == "fadeOut"){
                    Iout = document.getElementById('sponsor0');
                    Iin  = document.getElementById('sponsor1');
                }else{
                    Iin = document.getElementById('sponsor0');
                    Iout  = document.getElementById('sponsor1');
                }
                console.log(Iin,Iout);
                if(Iin.src != localLives[index].url){
                    Iin.src = localLives[index].url;
                    Iout.className = "fadeOut";
                    Iin.className = "fadeIn";
                }

                setTimeout(() => {
                    spinerSponsors(index + 1);
                }, 25000);
            }
        });
    }
}

function spinerAds(index){
    nodecg.readReplicant("ads",'rbr', (run) => {
        if(run){
            var limit = run.length || 1;
            if(index >= limit){
                index = 0;
            }
            var nexttext = run[index];
            var Iin,Iout;
            if(document.getElementById('Ad1').className == "scrollOut"){
                Iout = document.getElementById('Ad0');
                Iin  = document.getElementById('Ad1');
            }else{
                Iin = document.getElementById('Ad0');
                Iout  = document.getElementById('Ad1');
            }
            Iin.innerHTML = "<div>"+nexttext+"</div>";
            Iout.className = "scrollOut";
            Iin.className = "scrollIn";
        }
        setTimeout(() => {
            spinerAds(index + 1);
        }, 20000);
    });
}

const getFontSize = (textLength,limit,baseSize) => {
    var fontSize =  baseSize/ (textLength/1.5);
    if(fontSize>limit){
        fontSize = limit;
    }
    return `${fontSize}vw`;
}

nodecg.listenFor('ReloadVideo', function (data, ack) {

    searchVideo(localData.players[data.index].stream,data.index);
});

var cropData = nodecg.Replicant('singleRunCrop');

cropData.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){    
        if(document.getElementById('videos')){
            crop(newVal);
        }
    }
});

function crop(data){
    areas.forEach((area)=>{
        data.forEach((cropData,index)=>{
            var FrameE = document.getElementById('VideoFrame'+index+area);
            if(cropData[area] && cropData[area].x!=null){
                var dataE = cropData[area];
                FrameE.classList.remove("hidden");
                FinalCrop(dataE,FrameE);
                if(area == "Tracker"){
                    if(document.getElementById(`Tracker${index}Div`)){
                        document.getElementById(`Tracker${index}Div`).classList.add("hidden")
                    }
                }
    
            }else{
                FrameE.classList.add("hidden");
                var video = document.getElementById("Video"+index+area);
                video.pause()
                if(area == "Tracker"){
                    if(document.getElementById(`Tracker${index}Div`)){
                      document.getElementById(`Tracker${index}Div`).classList.remove("hidden")
                    }
                }
            }
    
        })
    })
}

if(document.getElementById('SponsorDiv')){
    spinerSponsors(0);
}

spinerAds(0);


const discordData = nodecg.Replicant(`DiscordData`);
        
discordData.on('change', (newVal, oldVal) => {
    if(newVal && newVal !== oldVal){
        setDiscord(newVal)
    }
});

function setDiscord(data){
    if(document.getElementById('DiscordDiv')){
        var html = "";
        data.forEach((user)=>{
            html += `<div class="discordItem"><img src="${user.avatar}"><div class="container"><div>${user.name}</div></div></div>`
        })
        document.getElementById('DiscordDiv').innerHTML = html;
    }
}

var finishTimes = nodecg.Replicant('finishTimes');

finishTimes.on('change', (newVal, oldVal) => {
    if(newVal && newVal !== oldVal){
        reorder(newVal)
    }
});

function reorder(data){
    if(document.getElementById('finish')){
        document.getElementById('ResultNome1').innerHTML = data[0].name;
        document.getElementById('ResultTwitch1').innerHTML = "twitch.tv/" + data[0].twitch;
        document.getElementById('ResultTempo1') .innerHTML = "Tempo Final :  " + data[0].finishTime.split(".")[0];    
        
        document.getElementById('ResultNome2').innerHTML = data[1].name;
        document.getElementById('ResultTwitch2').innerHTML = "twitch.tv/" + data[1].twitch;
        document.getElementById('ResultTempo2') .innerHTML = "Tempo Final :  " + data[1].finishTime.split(".")[0];      
    }
}

function FinalCrop(data,frame){
    var obj = frame.firstElementChild;
    var Pwidth = parseInt(frame.offsetWidth);
    var Pheight = parseInt(frame.offsetHeight);
    var Owidth = 854;
    var Oheight = 480;

    var width = parseInt((Owidth * Pwidth) / data.w);
    var height = parseInt((Oheight * Pheight) / data.h);

    var left = parseInt((data.x*width)/Owidth);
    var top = parseInt((data.y*height)/Oheight);

    obj.style.marginTop  = `-${top}px`;
    obj.style.marginLeft = `-${left}px`;
    obj.style.width  = `${width}px`;
    obj.style.height = `${height}px`;

}


var css = nodecg.Replicant('layouts');

css.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
      var html="<style>";
      var Div = document.getElementById('Css');
      if(newVal){
      newVal.forEach(element => {
        if(element.css){
          html += `/*${element.size}*/
.${element.size} #front{
${element.css.frame?`background: url('/assets/rbr/frames/${element.css.frame}.png');`:""}
}
.${element.size} #back{
    ${element.css.background?`background: url('/assets/rbr/background/${element.css.background}.png');`:""}
    }
`;
if(element.css.itens){
        element.css.itens.forEach(item => {
          html += `.${element.size} #${item.name}{
  ${item.data?item.data:"display:none"}
}
`;
});
}
if(element.css.players){
        element.css.players.forEach(item => {
  html += `.${element.size} #${item.name}{
    ${item.data?item.data:"display:none"}
}
`;
});
}
      }
      });
    }
      html +="</style>"
      Div.innerHTML = html;
      adjust();
    }
});


function adjust(){
    nodecg.readReplicant("layouts",'rbr', (value) => {
      var element = value.filter(e=>e.name == CanvasClass);
      if(element[0]){
        if(element[0].css){
          element[0].css.auto.forEach(item => {
            document.querySelectorAll(item.name).forEach(box => {
              box.style.fontSize = getFontSize(box.textContent.length,item.baseSize,item.minSize,item.maxSize)
            })
          });
        }
      }
    });
    
    nodecg.readReplicant("singleRunCrop",'rbr', (value) => {
        if(document.getElementById('videos')){
            crop(value);
        }
    })
  }
  
function createDivs(data){
    if(document.getElementById('front')){

        var videos = document.getElementById('videos');
        var htmlVideo ="";

        var runnerInfo = document.getElementById('runnerInfo');
        var htmlRunners ="";
        
        var trackers = document.getElementById('TrackerDiv');
        var htmlTrackers = "";
        if(data.players){
            var players = 0;
            data.players.forEach((player)=>{
                if(videos){
                    htmlVideo += `<div id="VideoFrame${players}Game" class="frame">
                        <video id="Video${players}Game"></video>
                    </div>
                    <div id="VideoFrame${players}Timer" class="frame">
                        <video id="Video${players}Timer" muted></video>
                    </div>
                    <div id="VideoFrame${players}Tracker" class="frame">
                        <video id="Video${players}Tracker"muted ></video>
                    </div>
                    <div id="VideoFrame${players}Camera" class="frame">
                        <video id="Video${players}Camera" muted></video>
                    </div>`;
                }
                if(runnerInfo){
                    htmlRunners+=`
                    <div id="Nation${players}Div" class="container">
                        <img id="Nation${players}" alt="" onerror="imgError(this)"/>
                        <div class="cover"></div>
                    </div>				
                    <div id="Twitch${players}Div" class="container">
                        <div id="Twitch${players}">${player.twitch}</div>
                    </div>		
                    <div id="Nome${players}Div" class="container">
                        <div id="Nome${players}">${player.name}</div>
                    </div>			
    
                    <img id="Avatar${players}" alt="" onerror="imgError(this)"/>`;
                }
                if(trackers){
                    htmlTrackers +=`<div id="Tracker${players}Div">	</div>`;

                }
                searchVideo(player.twitch,players)
                players++;
            })
        }

        if(videos){
            videos.innerHTML = htmlVideo;
        }
        if(runnerInfo){
            runnerInfo.innerHTML = htmlRunners;
        }
        if(trackers){
            htmlTrackers +=`<div id="TrackerPricesDiv">	</div>`;
            trackers.innerHTML = htmlTrackers;
        }
        document.getElementById('game') ? document.getElementById('game').innerHTML = data.game || "" :'';
        document.getElementById('system')? document.getElementById('system').innerHTML = data.system || "" :'';
        document.getElementById('estimate')? document.getElementById('estimate').innerHTML = data.estimate || "" :'';
        document.getElementById('category')? document.getElementById('category').innerHTML = data.category || "" :'';
        document.getElementById('title')? document.getElementById('title').innerHTML = data.title || "" :'';
        document.getElementById('subtitle')? document.getElementById('subtitle').innerHTML = data.subtitle || "" :'';
    }

    if(document.getElementById('starting')){
        if(data.players){
            var players = 0;
            var html = "";
            data.players.forEach((player,index)=>{
                html += `
                <img id="Avatar${index}" alt="" onerror="imgError(this)"/>
                <div id="Nation${index}Div" class="container">
                    <img id="Nation${index}" alt="" src="./img/flags/${player.nation}" onerror="imgError(this)"/>
                    <div class="cover"></div>
                </div>			
                <div id="Nome${index}Div" class="container">
                    <div id="Nome${index}">${player.name}</div>
                </div>	`;
                }

            )
            document.getElementById('InfosDiv')? document.getElementById('InfosDiv').innerHTML = html:"";
        }
    }
}