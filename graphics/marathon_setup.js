
var nextruns = nodecg.Replicant('nextruns');
var castInfo = nodecg.Replicant('castInfo');
var setupInfo = nodecg.Replicant('SetupData');
var speedcontrolBundle = 'nodecg-speedcontrol';

const GamesInfo1 = document.getElementById('GamesInfo1');
const GamesInfo2 = document.getElementById('GamesInfo2');
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
var localsetup;
var localafter;
var localData;


function getnextruns(run) {
    nodecg.readReplicant("runDataArray", speedcontrolBundle, (value) => {
        console.log(value)
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
      console.log(next5runs)
      nextruns.value = next5runs;
    });
}


var fonts = nodecg.Replicant('assets:fonts');
fonts.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        var FontsDiv = document.getElementById('Fonts');
        if(FontsDiv){
            var html="";
            newVal.forEach((e)=>{
                console.log(e)
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
});

setupInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localsetup = newVal;
        setupHtml(newVal,'setup')
    }
});

runDataActiveRun.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setupNext(newVal)
        getnextruns(newVal);
    }
});	
nextruns.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localafter = newVal;
        setupAfter(newVal)
    }
});	
castInfo.on('change', (newVal, oldVal) => {
    if(newVal){
      setCast(newVal)
      }
  });	
function setCast(newVal){
    var Host = document.getElementById('Host');

    Host.innerHTML=newVal.host;

    document.querySelectorAll('#Host').forEach(box => {
    box.style.fontSize = getFontSize(box.textContent.length,20,1.9)
    })
}

function setupNext(data){
    var html = "";
    if(data){

        html += `<div id="next">
            <div><span>${data.game?data.game.toUpperCase():""}</span></div>
            <div><span>${listplayers(data.teams)}</span></div>
            <div><span>${data.estimate.toUpperCase()}</span></div>
        </div>`;
    }

    GamesInfo1.innerHTML = html; 
    getFontSize();

    
    var boxes = document.querySelectorAll('#next div')

    //boxes.forEach(box => { box.style.fontSize = getFontSize(box.textContent.length,35)  })
}
function setupAfter(data){
    console.log(data)
    var html = "";
    var loop = 2;
    if (localsetup){
        loop = localsetup.runs;
    }
    for(var i = 0; i < loop ; i++){
        if(data[i]){
            html += `<div id="after${i}" class="after">
            <div><span>${data[i].game?data[i].game.toUpperCase():""}</span></div>
            <div><span>${listplayers(data[i].teams)}</span></div>
            <div><span>${data[i].estimate.toUpperCase()}</span></div>
            </div>`;
        }
    }
    
    GamesInfo2.innerHTML = html; 
    getFontSize();

    
    var boxes = document.querySelectorAll('#after div,#later div')
    
    //oxes.forEach(box => {box.style.fontSize = getFontSize(box.textContent.length,35)})
}
function listplayers(teams){
    var playernames = "";
    var vs = false;
    teams.forEach(team => {
        team.players.forEach(player=>{
            if(vs){
                playernames += " VS "
            }
            if(playernames.length > 0 && !vs){
                playernames += " E "
            }
            vs = false;
            playernames += player.name.toUpperCase();
        });
        vs = true;
    });
    return playernames;
}
const getFontSize = (textLength,baseSize) => {
    var fontSize =  baseSize/ (textLength/1.8);
    if(fontSize>2.1){
        fontSize = 2.1;
    }
    return `${fontSize}vw`;
}

var donate = nodecg.Replicant('donates');

donate.on('change', (newVal, oldVal) => {
    if(newVal != oldVal){ 
        if(document.getElementById('Donate')){
            document.getElementById('Donate').innerText = `R$ ${newVal}`;
        }
    }
});

var fundoInfo = nodecg.Replicant('BackgroundData');

fundoInfo.on('change', (newVal, oldVal) => {
    if(newVal){
      localData = newVal;
      setupHtml(newVal,'back')
    }
  });	

function setupHtml(data,id){
    var fundo = document.getElementById(id);
    var css = document.getElementById('Css'+id);
    if(fundo){
      fundo.innerHTML = data.html;
    }
    if(css){
      css.innerHTML = `<style>${data.css}</style>`;
    }
    
}

var sponsors = nodecg.Replicant('assets:sponsorsMarathon');
var sponsorsList;
sponsors.on('change', (newVal, oldVal) => {
    if(newVal != oldVal){
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

function spinerSponsors(index){
    nodecg.readReplicant("assets:sponsorsMarathon",'rbr', (sponsorsList) => {
        var w = 0;
        var h = 0;

        if(document.getElementById('SponsorDiv')){
            w = document.getElementById('SponsorDiv').offsetWidth;
            h = document.getElementById('SponsorDiv').offsetHeight;
        }

        if(document.getElementById('sponsor1')){
            document.getElementById('sponsor0').style = `max-width:${w}px;max-height:${h}px;`;
            document.getElementById('sponsor1').style = `max-width:${w}px;max-height:${h}px;`;
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
    })
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

spinerSponsors(0)
spinerAds(0)