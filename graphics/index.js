
var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var runDataActiveRunSurrounding = nodecg.Replicant('runDataActiveRunSurrounding', speedcontrolBundle);
var timer = nodecg.Replicant('timer', speedcontrolBundle);
var timerElem = document.getElementById('Timer');
var maintimer = document.getElementById('Timer');
var PlayersNum = 0;
var castInfo = nodecg.Replicant('castInfo');

var localExtra;
var mainInfo = nodecg.Replicant('MainData');
var localmain;

var currentExtra = nodecg.Replicant('currentExtra');
currentExtra.on('change', (newVal, oldVal) => {
  if(newVal && newVal != oldVal){
      localExtra = newVal;
  }
});

mainInfo.on("change", (newVal, oldVal) => {
  if(newVal && newVal != oldVal){
    localmain = newVal;
      setupData(newVal);
  }
});

function setupData(data){
  if(data){
      var fundo = document.getElementById('frame');
      var css = document.getElementById('CssMain');

      fundo.innerHTML = data.html;
      css.innerHTML = `<style>${data.css}</style>`;
  }
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

castInfo.on('change', (newVal, oldVal) => {
  if(newVal){
    setCast(newVal)
    }
});	
var CanvasClass= "";
runDataActiveRun.on('change', (newVal, oldVal) => {
  if(newVal && newVal != oldVal){
    setTimeout(()=>{setup(newVal)},5000);
    }
});	
timer.on('change', (newVal, oldVal) => {
    if(newVal){
        updateTimer(newVal)
    }
});	
function setup(data){
    //player Info
    const canvas = document.getElementById('canvas');
    PlayersNum=0;
    for (var i = 0;i<data.teams.length;i++){
        for (var j = 0;j<data.teams[i].players.length;j++){
            PlayersNum++;
            const playerName = document.getElementById('Player'+PlayersNum);
            playerName.innerHTML = `<span>${data.teams[i].players[j].name}</span>`;
        }
    }
    for (var i = PlayersNum;i<4;i++){
        const playerName = document.getElementById('Player'+(i+1));
        playerName.innerHTML = "";
    }
    getCanvasClass(PlayersNum,data.system)
    canvas.classList = [CanvasClass];
    
    //systemInfo
    document.getElementById('Estimate').innerHTML = `<span>${data.estimate}</span>`;
    document.getElementById('Category').innerHTML = `<span>${data.category}</span>`;
    document.getElementById('System').innerHTML = `<span>${data.system}</span>`;
    document.getElementById('Game').innerHTML = `<span>${data.game}</span>`;

/*
    document.querySelectorAll('#Category').forEach(box => {
        box.style.fontSize = getFontSize(box.textContent.length,20,getmaxsize(CanvasClass))
    })
    document.querySelectorAll('#Game').forEach(box => {
      box.style.fontSize = getFontSize(box.textContent.length,25,getmaxsize(CanvasClass))
    })
    document.querySelectorAll('.player').forEach(box => {
      box.style.fontSize = getFontSize(box.textContent.length,30,getmaxsize(CanvasClass))
    })
*/
}
function getmaxsize(CanvasClass){
  var max = 1.8;
  switch(CanvasClass){
    case 'solo3DS':
      max = 1.75;
    break;
  }
  return max;
}
const getFontSize = (textLength,baseSize,minsize,maxsize) => {
  console.log (textLength,baseSize,maxsize) 
  var fontSize =  baseSize/ (textLength/1.8);
  if(fontSize < minsize){
    fontSize = minsize;
  }
  if(fontSize > maxsize){
      fontSize = maxsize;
  }
  return `${fontSize}vw`;
}
function updateTimer(newVal) {
  maintimer.innerHTML = newVal.time.replaceAll(":",".");
  switch(newVal.state){
    case 'paused':
      maintimer.classList = ['paused']
      break;
    case 'running':
      maintimer.classList = ['running']
      break;
    case 'finished':
      maintimer.classList = ['finished']
      break;
    case 'stopped':
      maintimer.classList = ['stopped']
      break;
  }
}
function setCast(newVal){
  var Host = document.getElementById('Host');
  var Couch = document.getElementById('Couch');

  Host.innerHTML = `<span>${newVal.host}</span>`;
  Couch.innerHTML = `<span>${newVal.couch}</span>`;
/*
  document.querySelectorAll('#Host').forEach(box => {
    box.style.fontSize = getFontSize(box.textContent.length,20,getmaxsize(CanvasClass))
  })
  document.querySelectorAll('#Couch').forEach(box => {
    box.style.fontSize = getFontSize(box.textContent.length,28,getmaxsize(CanvasClass))
  })
*/
}
function getCanvasClass(PlayersNum,system){
  
  if(localExtra.layout != null){
    CanvasClass = localExtra.layout;
    adjust();
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
    adjust();
  }
}

var css = nodecg.Replicant('layouts');

css.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
      var html="<style>";
      var Div = document.getElementById('Css');
      if(newVal){
      newVal.forEach(element => {
        if(element.css){
          html += `/*${element.name}*/
.${element.name}{
${element.css.background?`background: url('/assets/rbr/frames/${element.css.background}.png');`:""}
}
`;
        element.css.itens.forEach(item => {
          html += `.${element.name} #${item.name}{
  ${item.data}
}
`;
});
        element.css.players.forEach(item => {
  html += `.${element.name} .${item.name}{
${item.data}
}
`;
});
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
}
