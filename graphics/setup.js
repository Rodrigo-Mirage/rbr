
var nextruns = nodecg.Replicant('nextruns');
var castInfo = nodecg.Replicant('castInfo');
var setupInfo = nodecg.Replicant('SetupData');

const GamesInfo1 = document.getElementById('GamesInfo1');
const GamesInfo2 = document.getElementById('GamesInfo2');
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
var localsetup;
var localafter;



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
        setup(newVal);
    }
});

runDataActiveRun.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setupNext(newVal)
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

function setupNext(data){
    var html = "";
    if(data){

        html += `<div id="next">
            <div><span>${data.game?data.game.toUpperCase():""}</span></div>
            <div><span>${data.category?data.category.toUpperCase():""}</span></div>
            <div><span>${listplayers(data.teams)}</span></div>
        </div>`;
    }

    GamesInfo1.innerHTML = html; 
    getFontSize();

    
    var boxes = document.querySelectorAll('#next div')

    //boxes.forEach(box => { box.style.fontSize = getFontSize(box.textContent.length,35)  })
}
function setupAfter(data){
    var html = "";
    var loop = 2;
    if (localsetup){
        loop = localsetup.runs;
    }
    for(var i = 0; i < loop ; i++){
        if(data[i]){
            html += `<div id="after${i}" class="after">
            <div><span>${data[i].game?data[i].game.toUpperCase():""}</span></div>
            <div><span>${data[i].category?data[i].category.toUpperCase():""}</span></div>
            <div><span>${listplayers(data[i].teams)}</span></div>
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
function setCast(newVal){
    var Host = document.getElementById('Host');
  
    Host.innerHTML=newVal.host;
  
    document.querySelectorAll('#Host').forEach(box => {
      box.style.fontSize = getFontSize(box.textContent.length,20,1.9)
    })
}

function setup(setupData){
    if(setupData){
        var fundo = document.getElementById('frame');
        var css = document.getElementById('Css');

        fundo.innerHTML = setupData.html;
        css.innerHTML = `<style>${setupData.css}</style>`;
    }
    setupAfter(localafter)
}