
var fundoInfo = nodecg.Replicant('BackgroundData');
var obsSettings = nodecg.Replicant('obs:programScene');


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var scene = urlParams.get('scene');
var localData = [];

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
fundoInfo.on('change', (newVal, oldVal) => {
  if(newVal){
    localData = newVal;
    setup(newVal)
  }
});	

obsSettings.on('change', (newVal, oldVal) => {
  if(newVal){
    scene = newVal['name'];
    setup(localData)
  }
});		


function setup(data){
  scene = scene ? scene : "Default";
  var setupData = data.find(e=>e.name == scene);
console.log(setupData)
  if(!setupData){
    scene = scene ? scene : "Default";
    setupData = data.find(e=>e.name == scene);
  }

  console.log(setupData)
  if(setupData){
    var fundo = document.getElementById('fundo');
    var css = document.getElementById('Css');

    fundo.innerHTML = setupData.html;
    css.innerHTML = `<style>${setupData.css}</style>`;
  }
}