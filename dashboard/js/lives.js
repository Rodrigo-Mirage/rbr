
var single = nodecg.Replicant('singleRun');
var openLives = nodecg.Replicant('StreamsOn');

var localList=[];

single.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setup(newVal);
    }
});

openLives.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localList = newVal;
        setupLives(newVal);
    }
});

function setup(data){
    var div = document.getElementById('Lives');
    var html = "";
    data.players.forEach(player=>{
        html += `
            <fieldset>
                <legend>${player.name}</legend>
                <div id='${player.stream}Div'></div>
                <button onclick="getStream('${player.stream}','${player.stream}Div')">Get</button>
            </fieldset>
        `;
    })
    div.innerHTML = html;
}

function setupLives(data){
    var div = document.getElementById('StreamsOn');
    var got = [];
    var html = "";

    data.forEach(player=>{
        if(!got.includes(player.name)){
            got.push(player.name);
            html += `<fieldset>
                <legend>${player.name}</legend>`
            var filter = localList.filter(e=>{ return e.name == player.name})
            console.log(filter)
            console.log(localList)
            filter.forEach(q => {
                html += `<button onclick="kill('${player.name}_${q.quality}')">${q.quality}</button>`;
           });
           html += `</fieldset>`
        }
    });

    div.innerHTML = html;
}

function getStream(channel,id){
    $.ajax({
    url: "/player/"+channel,
    success: (e)=>{
        if(e){
            setButtons(channel,id,e);
        }else{
            var buttons = document.getElementById(id);
            var html = "Live Off";
            buttons.innerHTML = html;
        }
    }
  });
}

function setButtons(channel,id,data){
    var buttons = document.getElementById(id);
    var html = "";
    var html2 = "";
    data.forEach(element => {
        html += `<button onclick="startDownload('${channel}','${element.quality}','${element.quality.split("p")[0]}')">${element.quality}</button>`;
    });
    buttons.innerHTML = html;
}

function setListButtons(data){
    var buttons = document.getElementById("StreamsOn");
    var html = "";
    data.forEach(element => {
      html += `<fieldset><legend>${element.stream}</legend>`;
      html += `<button onclick="kill()">Kill</button>`;
      element.qualities.forEach(q => {
           html += `<button onclick="setvideo('/video/${element.stream}_${q}.m3u8','${q}')">${q}</button>`;
      });
      html += `</fieldset>`;
    });
    buttons.innerHTML = html;
}

function startDownload(stream,res,qualy){
    $.ajax({
        url: "/download/rbr/"+stream+"|"+res+"|"+qualy,
        success: (e)=>{
            var item = {name:stream,quality:qualy};
            localList.push(item)
            openLives.value = localList;
        }
    })
}

function kill(name){
    $.ajax({
        url: "/kill/"+name,
        success: (e)=>{
            console.log(localList)
            removeStream(name)
        }
    })
}
function removeStream(name){
    var newArray = [];
    var qualy = name.split("_")[name.split("_").length-1];
    var stream = name.replace("_"+qualy,"")
    localList.forEach((item)=>{
        if(item.name != stream || item.quality != qualy){
            newArray.push(item)
        }
    })
    openLives.value = newArray;
}


function killAll(){
    $.ajax({
        url: "/kill/all",
        success: (e)=>{
            openLives.value = [];
        }
    })
}


