
var cropData = nodecg.Replicant('marathonCrop');

var speedcontrolBundle = 'nodecg-speedcontrol';
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var originalData = {};
var localData = {};
var index;

var areas = ["Game","Camera","Timer","Tracker"];

var defaultCrop = {
    video:[{ Game:{ x:0,y:0,h:480,w:854 }}]
}

cropData.on('change', (newVal, oldVal) => {
    if(!newVal){
        cropData.value = defaultCrop;
    }
    if(newVal){
        localData = cropData.value;
        originalData = cropData.value;
    }
});

function Save(){
    cropData.value = localData;
    nodecg.sendMessage('dialog-confirmed');
}

function change(input){
    document.getElementById(`crop`).className = input;
    areas.forEach((area)=>{
        var Preview = document.getElementById("Preview"+area);
        const elemHeight = Preview.offsetHeight;
        const elemWidth = Preview.offsetWidth;
        var obj = Preview.firstChild;
        obj.style.height = elemHeight+"px";
        obj.style.width = elemWidth+"px";
    
    })
    setCropper(localData.video[index])
}

function Clear(){
    cropData.value = defaultCrop;
}

nodecg.listenFor('editCropMarathon', function (data, ack) {
    console.log(data)
    localData = data.crop;
    index = data.index;
    areas.forEach((area)=>{
        if(document.getElementById("hasPrev"+area)){
            console.log(localData)
            document.getElementById("hasPrev"+area).checked = false;
            console.log(localData.video[index])
            if(localData.video[index] && localData.video[index][area]){
                if(localData.video[index][area].x != null){
                    document.getElementById("hasPrev"+area).checked = true;
                }
            }
        }
    });

    setupEdit();
});

function setupEdit(){
    nodecg.readReplicant("runDataActiveRun",speedcontrolBundle, (data) => {
        var cont = 0;
        data.teams.forEach(team=>{
            team.players.forEach(player=>{
                if( cont == index){
                    searchVideo(player.social.twitch)
                }
                cont++;
            });
        });
    });
    ShowPrev()
    setTimeout(() => {
        window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#dialogs").querySelector("#rbr_cropMarathon").style.left = "-42px";
        window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#dialogs").querySelector("#rbr_cropMarathon").style.width = "100%";
    }, 1000);
}

function searchVideo(player){
    nodecg.readReplicant("StreamsOnMarathon",'rbr', (localLives) => {
        var lives = localLives.filter(e=>{return e.name == player});
        if(lives[0]){
            var url = `/video/rbr/${lives[0].name}|${lives[0].quality}.m3u8`;
            setvideo(url,"Video0");
            setvideo(url,"Video1");
            setvideo(url,"Video2");
            setvideo(url,"Video3");
            setvideo(url,"Video4");
        }
    });
}

function ShowPrev(rem){
    areas.forEach((area)=>{
        if(area !="Game"){
            var Preview = document.getElementById("Preview"+area);
   
            var cropper = document.getElementById("cropper"+area);
            if(!document.getElementById("hasPrev"+area).checked){
                if(rem){
                    localData.video[index][area] = {};
                }
                Preview.classList.add("hidden");
                cropper.classList.add("hidden");
            }else{
                if(rem){
                    localData.video[index][area] = {x:0,y:0,h:480,w:854};
                }
                Preview.classList.remove("hidden");
                cropper.classList.remove("hidden");
            }
        }
    })
    setCropper(localData.video[index])
}


function setCropper(data){
    areas.forEach((area)=>{
        var Preview = document.getElementById("Preview"+area);

        var l = data[area] ? data[area].x || 0 : 0;
        var t = data[area] ? data[area].y || 0 : 0;
    
        var w = data[area] ? data[area].w || 10 : 10;
        var h = data[area] ? data[area].h || 10 : 10;
    
        var cropper = document.getElementById("cropper"+area);
    
        cropper.style.width  = `${w>50?w:50}px`;
        cropper.style.height = `${h>50?h:50}px`;
        cropper.style.transform = `translate(${l}px, ${t}px)`;
        if(data[area]){
            FinalCrop(data[area],Preview)
        }
    })
}

function Convert(){
    areas.forEach((area)=>{
        var l,t,h,w;
        console.log(l,t,h,w)
        if(area == "Game" || document.getElementById("hasPrev"+area).checked){
            var cropper = document.getElementById("cropper"+area);
            if(cropper.style.transform){
                var translates = cropper.style.transform.split("(")[1].split(")")[0];
                l = parseInt(translates.split("px, ")[0]);
                t = parseInt(translates.split(", ")[1].split("px")[0]);
                w = parseInt(cropper.style.width.split("px")[0]);
                h = parseInt(cropper.style.height.split("px")[0]);
                var Preview = document.getElementById("Preview"+area);
    
                FinalCrop( {x:l,y:t,h:h,w:w},Preview);
            }
        }

        localData.video[index][area] = 
        {
            x:l,
            y:t,
            h:h,
            w:w
        }
    })
} 

function FinalCrop(data,frame){
    console.log(data,frame)
    var obj = frame.firstChild;

    var Pwidth = parseInt(frame.offsetWidth);
    var Pheight = parseInt(frame.offsetHeight);
    
    var Owidth = 854;
    var Oheight = 480;

    var width = parseInt((Owidth * Pwidth) / data.w);
    var height = parseInt((Oheight * Pheight) / data.h);
    console.log(width,height)

    var left = parseInt((data.x*width)/Owidth);
    var top = parseInt((data.y*height)/Oheight);

    obj.style.marginTop  = `-${top}px`;
    obj.style.marginLeft = `-${left}px`;
    obj.style.width  = `${width}px`;
    obj.style.height = `${height}px`;

}

function changeCrop(axis, adition,area){
    var temp = localData;
    area = area?area:"Game";
    temp.video[index][axis][area] = adition == "+"? parseInt(temp.video[index][axis]) + 1: parseInt(temp.video[index][axis]) - 1;
    localData.value = temp;
    setCropper(temp.video[index])
}

interact("#cropperGame,#cropperTimer,#cropperTracker,#cropperCamera").resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },

    listeners: {
      move (event) {
        var target = event.target;

        var l = 0,t = 0;
        if(target.style.transform){
            var translates = target.style.transform.split("(")[1].split(")")[0];
            l = parseInt(translates.split("px, ")[0]);
            t = parseInt(translates.split(", ")[1].split("px")[0]);
        }else{
            var area = target.id.replace("cropper");
            if(localData.video[index][area]){
                l = localData.video[index][area]["x"];
                t = localData.video[index][area]["y"];
            }
        }
        var x = (parseFloat(target.getAttribute('data-x')) || l)
        var y = (parseFloat(target.getAttribute('data-y')) || t)
        // update the element's style
        target.style.width = event.rect.width + 'px'
        target.style.height = event.rect.height + 'px'

        // translate when resizing from top or left edges
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
        Convert()
      }
    },
    modifiers: [
      // keep the edges inindex the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),

      // minimum size
      interact.modifiers.restrictSize({
        min: { width: 30, height: 30 }
      })
    ],

    inertia: true
  })
  .draggable({
    listeners: { move: window.dragMoveListener,
      end (event) {
        Convert()
      }},
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
})

function dragMoveListener (event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
  
    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
  
window.dragMoveListener = dragMoveListener;