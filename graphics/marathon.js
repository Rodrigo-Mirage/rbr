var localData;

var speedcontrolBundle = 'nodecg-speedcontrol';
var speedcontrolRep = 'runDataActiveRun';
var runDataActiveRun = nodecg.Replicant(speedcontrolRep, speedcontrolBundle);
var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);

var single = nodecg.Replicant('singleRun');
var timerRep = nodecg.Replicant('timer', speedcontrolBundle);
var sponsors = nodecg.Replicant('assets:sponsorsMarathon');
var loop = true;
var sponsorsList;
var layout ="";
var players = 0;
var areas = ["Game","Camera","Timer","Tracker"];


var localExtra;

var CanvasClass= "";

var fundoInfo = nodecg.Replicant('BackgroundData');
var setupInfo = nodecg.Replicant('SetupData');
var mainInfo = nodecg.Replicant('MainData');

fundoInfo.on('change', (newVal, oldVal) => {
    if(oldVal && newVal != oldVal){
      setupHtml(newVal,'back')
    }
  });	
setupInfo.on('change', (newVal, oldVal) => {
    if(oldVal && newVal != oldVal){
        setupHtml(newVal,'setupExtra')
    }
});	
mainInfo.on('change', (newVal, oldVal) => {
    if(oldVal && newVal != oldVal){
        setupHtml(newVal,'MainExtra')
    }
});	

var fonts = nodecg.Replicant('assets:fonts');
fonts.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        loadFonts(newVal)
    }
});

function loadFonts(newVal){
    var FontsDiv = document.getElementById('Fonts');
    if(FontsDiv){
        var html="";
        newVal.forEach((e)=>{
            html+=`
                @font-face {
                    font-family: "${e.name}";
                    src: url("/assets/rbr/fonts/${e.base}") format("opentype");
                }
            `;
        })
        FontsDiv.innerHTML = html;
    }
}

NodeCG.waitForReplicants(fundoInfo, mainInfo,setupInfo,sponsors,fonts).then(() => {
    setupHtml(fundoInfo.value,'back')
    setupHtml(mainInfo.value,'MainExtra')
    setupHtml(setupInfo.value,'setupExtra')
    loadFonts(fonts.value)
    if(document.getElementById('SponsorDiv')){
        sponsorsList = sponsors.value;
        preload("sponsorsMarathon",sponsorsList)
        spinerSponsors(0);
    }
    
});

function setupHtml(data,id){
    if(data){
        var fundo = document.getElementById(id);
        var css = document.getElementById('Css'+id);
        if(fundo){
            fundo.innerHTML = data.html;
        }
        if(css){
          css.innerHTML = `<style>${data.css}</style>`;
        }
    }
}

var currentExtra = nodecg.Replicant('currentExtra');
currentExtra.on('change', (newVal, oldVal) => {
    localExtra = newVal;
  if(oldVal && newVal != oldVal){
      getCanvasClass();
  }
});

var cropData = nodecg.Replicant('marathonCrop');

var cropDataLocal; 
cropData.on('change', (newVal, oldVal) => {
    cropDataLocal = newVal;
    if(oldVal && newVal != oldVal){ 
        if(document.getElementById('videos')){
            crop(newVal);
        }
    }
});

sponsors.on('change', (newVal, oldVal) => {
    if(oldVal && newVal != oldVal){
        sponsorsList = newVal; 
        preload("sponsorsMarathon",newVal)
    }
});

function preload(asset,imgList){
    var load="";
    imgList.forEach((e)=>{
        load += "<img src='/assets/rbr/"+asset+"/"+e.base+"' style='width: 1px;'/>";
    })
    if(document.getElementById('load'+asset)){
        document.getElementById('load'+asset).innerHTML = load;
    }

}

timerRep.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        var timer = document.getElementById('timer');
        if(timer){
            timer.innerHTML = newVal.time;
        }
    }
});

runDataActiveRun.on('change', async (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localData = newVal;
        createDivs(newVal)
        getCanvasClass();
    }
});

function showstream(player){
    var text = "";

    if(!player.twitch && player.twitch != player.name){
        text = player.twitch;
    }

    return text;
}

function searchVideo(player,index){
    nodecg.readReplicant("marathonVideoStatus",'rbr', (status) => {
        if(status){
            nodecg.readReplicant("StreamsOnMarathon",'rbr', (localLives) => {
                var lives = localLives.filter(e=>{return e.name == player});
                var sta = status.videos.filter(e=>{return e.stream == player});
                if(lives[0]){
                    var url = `/video/rbr/${lives[0].name}|${lives[0].quality}.m3u8`;
                    areas.forEach((area)=>{
                        if(cropDataLocal.video[index][area] && cropDataLocal.video[index][area].x != null){
                            setvideo(url,"Video"+index+area, area ? sta.mute == true?0:sta.volume:0);
                        }
                    })
                }
            });
        }
    });
}

function reSearchVideo(index,area){
    nodecg.readReplicant("marathonVideoStatus",'rbr', (status) => {
        if(status){
            nodecg.readReplicant("StreamsOnMarathon",'rbr', (localLives) => {
                var sta = status.videos[index];
                var lives = localLives.filter(e=>{return e.name == sta.stream});
                if(lives[0]){
                    var url = `/video/rbr/${lives[0].name}|${lives[0].quality}.m3u8`;
                    if(cropDataLocal.video[index][area] && cropDataLocal.video[index][area].x != null){
                        setvideo(url,"Video"+index+area, area ? sta.mute == true?0:sta.volume:0);
                    }
                }
            });
        }
    });
}

function spinerSponsors(index){
    if(document.getElementById('sponsor1')){
            if(sponsorsList){
                if (sponsorsList.length > 0){
                    if(index >= sponsorsList.length){
                        index = 0;
                    }

                    var Iin,Iout;
                    if(document.getElementById('sponsor1').className == "hidden" || document.getElementById('sponsor1').className == "fadeOut"){
                        Iout = document.getElementById('sponsor0');
                        Iin  = document.getElementById('sponsor1');
                    }else{
                        Iin = document.getElementById('sponsor0');
                        Iout  = document.getElementById('sponsor1');
                    }
                    if(Iin.src != sponsorsList[index].url){
                        Iin.src = "/assets/rbr/sponsorsMarathon/"+sponsorsList[index].base;
                        Iout.className = "fadeOut";
                        Iin.className = "fadeIn";
                    }
                    setTimeout(() => {
                        spinerSponsors(index + 1);
                    }, 15000);
                }
            }
    }
}

function spinerAds(index){
    nodecg.readReplicant("ads",'rbr', (run) => {
        if(run){
            if(document.getElementById('AdDiv')){
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
        }
        setTimeout(() => {
            spinerAds(index + 1);
        }, 20000);
    });
}

nodecg.listenFor('ReloadVideo', function (data, ack) {
    nodecg.readReplicant("marathonCrop",'rbr', (crops) => {
        areas.forEach(area=>{
            if(crops.video[data.index][area] && crops.video[data.index][area].x!=null){
                reSearchVideo(data.index,area);
            }
        })
    });
});

function crop(data){
    areas.forEach((area)=>{
        data.video.forEach((cropData,index)=>{
            var Frame = document.getElementById('VideoFrame'+index+area);
            if(Frame){
                if(cropData[area] && cropData[area].x!=null){
                    var dataE = cropData[area];
                    reSearchVideo(index,area)
                    FinalCrop(dataE,Frame);
        
                }else{
                    var video = document.getElementById("Video"+index+area);
                    video.pause()
                }
            }
    
        })
    })
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

function createDivs(data){
    if(document.getElementById('front')){

        var videos = document.getElementById('videos');
        var htmlVideo ="";

        var runnerInfo = document.getElementById('runnerInfo');
        var htmlRunners ="";
        if(data.teams){
            players = 0;
            data.teams.forEach((team)=>{
                team.players.forEach((player)=>{
                    if(videos){
                        htmlVideo += `<div id="VideoFrame${players}Game" class="frame">
                            <video id="Video${players}Game"></video>
                        </div>
                        <div id="VideoFrame${players}Timer" class="frame">
                            <video id="Video${players}Timer" muted></video>
                        </div>
                        <div id="VideoFrame${players}Tracker" class="frame">
                            <video id="Video${players}Tracker" muted></video>
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
                            <div id="Twitch${players}">${player.social.twitch}</div>
                        </div>		
                        <div id="Nome${players}Div" class="container">
                            <div id="Nome${players}">${player.name}</div>
                        </div>			
        
                        <img id="Avatar${players}" alt="" onerror="imgError(this)"/>`;
                    }
                
                    searchVideo(player.social.twitch,players)

                    players++;
                })
            })


            if(videos){
                videos.innerHTML = htmlVideo;
            }
            if(runnerInfo){
                runnerInfo.innerHTML = htmlRunners;
            }

            document.getElementById('game') ? document.getElementById('game').innerHTML = data.game? data.game:'':'';
            document.getElementById('system')? document.getElementById('system').innerHTML = data.system ? data.system :'':'';
            document.getElementById('estimate')? document.getElementById('estimate').innerHTML = data.estimate? data.estimate :'' :'';
            document.getElementById('category')? document.getElementById('category').innerHTML =  data.category? data.category  :'' :'';
            //document.getElementById('title')? document.getElementById('title').innerHTML = data.title :'';
            //document.getElementById('subtitle')? document.getElementById('subtitle').innerHTML = data.subtitle :'';
        }
    }
}

var videoStatus = nodecg.Replicant('marathonVideoStatus');

videoStatus.on('change', (newVal, oldVal) => {
    if(newVal){
        areas.forEach((area)=>{
            if(localData && localData.teams){
                var players = 0;
                localData.teams.forEach((team)=>{
                    team.players.forEach((player)=>{
                        var video = document.getElementById("Video"+players+area);
                        if(video && newVal.video && newVal.video[players]){
                            if(newVal && newVal != oldVal){
                                if(!oldVal || newVal.video[players].status != oldVal.video[players].status){
                                    switch(newVal.video[players].status){
                                        case "Play":
                                            video.play();
                                            break;
                                        case "Stop":
                                            video.pause();
                                            break;
                                    }
                                }
                                if(newVal.video[players].mute == true){
                                    video.volume = 0;
                                }else{
                                    video.volume = newVal.video[players].volume;
                                }
                            } 
                        }
                        players++;
                    })
                })
            }
        })
    }
});

async function getCanvasClass(){    
    nodecg.readReplicant(speedcontrolRep,speedcontrolBundle, (data) => {
        nodecg.readReplicant('currentExtra','rbr', (extra) => {
            
            var system = data.system;
            var PlayersNum = 0;
            data.teams.forEach((team)=>{
                team.players.forEach((player)=>{
                    PlayersNum++;
                })
            })

            if(extra && extra.layout != null){
                CanvasClass = extra.layout;
            }else{
                var layout169 = ['Wii','PC'];
                var layout43  = ['Genesis','GCN','N64','SNES','PlayStation','Dreamcast'];
                var layout3DS  = ['3DS','DS'];
                CanvasClass= "";
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
                if(layout169.includes(system)){
                    CanvasClass+="169";
                    sys = false;
                }
                if(layout43.includes(system)){
                    CanvasClass+="43";
                    sys = false;
                }
                if(layout3DS.includes(system)){
                    CanvasClass+="3DS";
                    sys = false;
                }
                if(sys){
                    CanvasClass+=system;
                }
            }
            document.body.classList = [CanvasClass];
            adjust();
        })
    })
}

var css = nodecg.Replicant('layouts');

css.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
      var html="<style>";
      var Div = document.getElementById('Css');
      if(newVal){
      newVal.forEach(element => {
        if(element.css){

            html += `/*${element.name}*/`;
if(element.css.background && element.css.background != "Selecione"){
          html += `
.${element.size} #back{
${element.css.background?`background: url('/assets/rbr/frames/${element.css.background}.png');`:""}
}
`;}

if(element.css.frame && element.css.frame != "Selecione"){
    html += `
.${element.size} #front{
    ${element.css.frame?`background: url('/assets/rbr/frames/${element.css.frame}.png');`:""}
    }
`;}
        element.css.itens.forEach(item => {
          html += `.${element.size} #${item.name}{
  ${item.data?item.data:"display:none"}
}
`;
});
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
          document.querySelectorAll(`#${item.name}`).forEach(box => {
            box.style.fontSize = getFontSize(box.textContent.length,item.baseSize,item.minSize,item.maxSize)
          })
          document.querySelectorAll(`.${item.name}`).forEach(box => {
            box.style.fontSize = getFontSize(box.textContent.length,item.baseSize,item.minSize,item.maxSize)
          })
        });
      }
    }
    nodecg.readReplicant("marathonCrop",'rbr', (run) => {
        if(document.getElementById('videos')){
            crop(run)
        }
    });
  });
}

const getFontSize = (textLength,baseSize,minsize,maxsize) => {
    var fontSize =  baseSize/ (textLength/1.8);
    if(fontSize < minsize){
      fontSize = minsize;
    }
    if(fontSize > maxsize){
        fontSize = maxsize;
    }
    return `${fontSize}vw`;
  }

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var scene = urlParams.get('scene');

var videoStatus = nodecg.Replicant('marathonVideoStatus');

var areas = ["Game","Camera","Timer","Tracker"];

videoStatus.on('change', (newVal, oldVal) => {

    if(newVal && newVal != oldVal){
        newVal.videos.forEach((vid,index)=>{
            areas.forEach((area)=>{
                var video = document.getElementById("Video"+index+area);
                if(video){
    
                    if(!oldVal || ( oldVal.videos[index] && vid.status != oldVal.videos[index].status )){
                        switch(vid.status){
                            case "Play":
                                video.play();
                                break;
                            case "Stop":
                                video.pause();
                                break;
                        }
                    }
    
                    if(vid.mute == true){
                        video.volume = 0;
                    }else{
                        video.volume = vid.volume;
                    }
                }
            })
        });
    }
});

var castInfo = nodecg.Replicant('castInfo');

castInfo.on('change', (newVal, oldVal) => {
    if(newVal){
      setCast(newVal)
      }
  });	

function setCast(newVal){
    var Host = document.getElementById('Host');
    if(Host){
        Host.innerHTML=newVal.host;
    }
    var Couch = document.getElementById('Couch');
    if(Couch){
        Couch.innerHTML=newVal.couch;
    }
}
