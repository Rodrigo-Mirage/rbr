var layouts = nodecg.Replicant('layouts');
var editlayouts = nodecg.Replicant('editLayouts');
var localLayouts = {};
var localeditlayouts = {};

var itemsBaseList =[
    "TimerDiv",
    "SystemDiv",
    "CategoryDiv",
    "EstimateDiv",
    "GameDiv",
    "HostDiv",
    "CouchDiv",
    "TitleDiv",
    "DiscordDiv",
    "SponsorDiv",
    "PokemonDiv",
    "AdDiv",
    "TrackerPrices",
    "Donate"
];
var framesItems = [
    "Game",
    "Timer",
    "Camera",
    "Tracker"
]

var frames = nodecg.Replicant('assets:frames');
var frameList = [];

frames.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        frameList = newVal;
    }
});	

var trackerOptions = [
    {
        name:'live',
        text:'Tracker da Live'
    },
    {
        name:'planilha_blitz',
        text:'Tracker RBR Blitz'
    },
    {
        name:'planilha',
        text:'Tracker RBR'
    },
    {
        name:'arq',
        text:'Arquipelago'
    }
];

layouts.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localLayouts = newVal;
        setup(newVal)
    }else{
        layouts.value = [];
    }
});

function setup(newVal){
    if(document.getElementById('List')){
        console.log(newVal)
        var html = "";
        html  += `<button id='newLayout' 
        class="nodecg-configure" nodecg-dialog="editLayouts" 
        onClick='NewLayout()'>Novo Layout</button>`;
        if(newVal){
            newVal.forEach(element => {
                html +=`<div class='ListItem'>
                <div class="ItemName"><span>${element.name}</span></div>
                <button class='greenBtn' nodecg-dialog="editLayouts" onClick='Edit("${element.name}")'>Edit</button>
                <button class='greenBtn'  nodecg-dialog="editLayouts" onClick='Clone("${element.name}")'>Clone</button>
                <button class='redBtn'  nodecg-dialog="delete" onClick='Delete("${element.name}")'>Delete</button></div>`;
            });
        }
        html  += `<button id='printLayout' 
        class="nodecg-configure" nodecg-dialog="editCss" 
        onClick=''>Print Css</button>`;
        document.getElementById('List').innerHTML = html;
    }
}

function NewLayout(){
    var obj = {
        name:"",
        size:'',
        players:0,
        new:true
    }
    obj.css = baseCss(obj);
    editlayouts.value = obj;

}

function Edit(name){
    if(localLayouts.filter(e=>e.name == name)){
        var toEdit = JSON.parse(JSON.stringify(localLayouts.filter(e=>e.name == name)[0]));
        console.log(toEdit)
        console.log(localLayouts)
        if(!toEdit.css){
            toEdit.css = baseCss(toEdit);
        }else{
            toEdit.css = validateCss(toEdit);
        }
        toEdit.new = false;
        editlayouts.value = toEdit;
    }
}
function Clone(name){
    if(localLayouts.filter(e=>e.name == name)){
        var toEdit = JSON.parse(JSON.stringify(localLayouts.filter(e=>e.name == name)[0]));
        if(!toEdit.css){
            toEdit.css = baseCss(toEdit);
        }else{
            toEdit.css = validateCss(toEdit);
        }
        toEdit.name = ""
        toEdit.new = true;
        editlayouts.value = toEdit;
        console.log(toEdit)
    }
}
function Delete(name){
    if(confirm(`Deletar o Layout ${name}?`) == true){
        localLayouts.splice(localLayouts.findIndex(e => e.name == name),1);
        layouts.value = localLayouts;
    }
}

function baseCss(lay){
    var obj = {
        background:"",
        frame:"",
        players:[],
        auto:[],
        itens:[]
    };
    itemsBaseList.forEach((item)=>{
        var it = {
            name: item,
            data: ""
        }
        obj.itens.push(it);
    })
    for(var i = 0 ; i < lay.players ; i++){
        framesItems.forEach((area)=>{
            var it = {
                name: `VideoFrame${i}`+area,
                data: ""
            }
            obj.players.push(it);
        })
        var areas = ["Nation","Nomes","Twitch"]
        areas.forEach((area)=>{
            var it = {
                name: area+`${i}Div`,
                data: ""
            }

            obj.players.push(it);
        })
        areas = ["Avatar","Tracker"]
        areas.forEach((area)=>{
            var it = {
                name: area+`${i}`,
                data: ""
            }

            obj.players.push(it);
        })
    }
    return obj;
}

function validateCss(base){
    var lay = base.css 
    var obj = {
        background:lay.background,
        frame:lay.frame,
        players:lay.players,
        auto:lay.auto,
        itens:lay.itens
    };
    var itens = []
    itemsBaseList.forEach((item)=>{
        var it = {
            name: item,
            data: ""
        }
        if(lay.itens){
            if(lay.itens[lay.itens.findIndex(e=>e.name == it.name)]){
                it = lay.itens[lay.itens.findIndex(e=>e.name == it.name)];
            }
        }

        itens.push(it);
    })
    obj.itens = itens;
    var players = []
    for(var i = 0 ; i < base.players ; i++){
        framesItems.forEach((area)=>{
            var it = {
                name: `VideoFrame${i}`+area,
                data: ""
            }
            if(lay.players){
                if(lay.players[lay.players.findIndex(e=>e.name == it.name)]){
                    it = lay.players[lay.players.findIndex(e=>e.name == it.name)];
                }
            }

            players.push(it);
        })
        var areas = ["Nation","Nome","Twitch"]
        areas.forEach((area)=>{
            var it = {
                name: area+`${i}Div`,
                data: ""
            }
            if(lay.players){
                if(lay.players[lay.players.findIndex(e=>e.name == it.name)]){
                    it = lay.players[lay.players.findIndex(e=>e.name == it.name)];
                }
            }

            players.push(it);
        })
        areas =["Avatar","Tracker"]
        areas.forEach((area)=>{
            var it = {
                name: area+`${i}`,
                data: ""
            }
            if(lay.players){
                if(lay.players[lay.players.findIndex(e=>e.name == it.name)]){
                    it = lay.players[lay.players.findIndex(e=>e.name == it.name)];
                }
            }

            players.push(it);
        })
    }
    obj.players = players;
    console.log(obj)
    return obj;
}

var BaseLayouts = [];

var BaseCropDefault = {
    's169':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":261,"left":463,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's43':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":0,"left":490,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's109':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":0,"left":729,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's32':{
        'cam':{'top':0,"bottom":829,"left":0,"right":1472},
        'game':{'top':0,"bottom":115,"left":462,"right":0},
        'tracker':{'top':334,"bottom":0,"left":0,"right":1474},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    },
    's3DS':{
        'cam':{'top':0,"bottom":760,"left":0,"right":1432},
        'game':{'top':0,"bottom":0,"left":506,"right":0},
        'tracker':{'top':585,"bottom":0,"left":0,"right":1436},
        'lower':{'top':300,"bottom":460,"left":0,"right":1432}
    }
};

editlayouts.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localeditlayouts = {};
        setupEdit(newVal)
    }
});

function setupEdit(newVal){
    if(document.getElementById('EditForm') && (newVal.name||newVal.new == true)){
        localeditlayouts.name = newVal.name;
        document.getElementById('Name').value = newVal.name;
        if(newVal.name != ""){
            document.getElementById('Name').setAttribute("disabled", "");
        }else{
            document.getElementById('Name').removeAttribute("disabled")
        }
        localeditlayouts.size = newVal.size;
        document.getElementById('Size').value = newVal.size;
        localeditlayouts.players = newVal.players;
        document.getElementById('Players').value = newVal.players;
        localeditlayouts.camera = newVal.camera;
        if (localeditlayouts.camera == true){
            document.getElementById("checkCamera").checked = true;
        }else{
            document.getElementById("checkCamera").checked = false;
        }
        localeditlayouts.timer = newVal.timer;
        if (localeditlayouts.timer == true){
            document.getElementById("checkTimer").checked = true;
        }else{
            document.getElementById("checkTimer").checked = false;
        }
        localeditlayouts.tracker = newVal.tracker;
        if (localeditlayouts.tracker == true){
            document.getElementById("checkTracker").checked = true;
        }else{
            document.getElementById("checkTracker").checked = false;
        }

        
        nodecg.readReplicant('assets:background','rbr', (value) => {
            var html = '';

            html = "<option>Selecione</option>";
            value.forEach((frame)=>{
                html += `<option value='${frame.name}' ${newVal.css.background==frame.name?"selected":""}>${frame.name}</option>`;
            });
            document.getElementById('Background').innerHTML = html;
        })

        nodecg.readReplicant('assets:frames','rbr', (value) => {
            var html = '';

            html = "<option>Selecione</option>";
            value.forEach((frame)=>{
                html += `<option value='${frame.name}' ${newVal.css.frame==frame.name?"selected":""}>${frame.name}</option>`;
            });
            document.getElementById('Frame').innerHTML = html;
        })


        localeditlayouts.css = {}
        localeditlayouts.css.background = newVal.css ? newVal.css.background : "";
        localeditlayouts.css.frame = newVal.css ? newVal.css.frame : "";


        localeditlayouts.css.players = newVal.css.players;
        html = '<fieldset class="collapsed"><legend onClick="setCollapse(this)">Players</legend>';
        for(var i= 0 ; i < newVal.players;i++){
            html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">Player ${i+1}</legend>`;
            
                html += '<fieldset class="collapsed"><legend onClick="setCollapse(this)">Videos</legend>';
                var item = `VideoFrame${i}Game`;          
                var dt =   newVal.css.players;
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                if(newVal.camera){
                    item = `VideoFrame${i}Camera`;              
                    html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                    <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                    </fieldset>`;
                }
                if(newVal.timer){
                    item = `VideoFrame${i}Timer`;              
                    html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                }
                if(newVal.tracker){
                    item = `VideoFrame${i}Tracker`;              
                    html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                }
                html += '</fieldset>';
            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">Infos</legend>`;

                item = `Nation${i}Div`;            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                
                item = `Twitch${i}Div`;            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                
                item = `Nome${i}Div`;            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                
                item = `Avatar${i}`;            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                
                item = `Tracker${i}`;            
                html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
                <textArea onChange="areaChange('players','${item}',this)">${dt.findIndex(e=>e.name == item)>-1?dt[dt.findIndex(e=>e.name == item)].data:""}</textarea>
                </fieldset>`;
                html += '</fieldset>';
                
            html += '</fieldset>';
        }
        html += `</fieldset><fieldset class="collapsed"><legend onClick="setCollapse(this)">Game Infos</legend>`;
        
        localeditlayouts.css.itens = newVal.css.itens;
        itemsBaseList.forEach((item)=>{
            html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
            <textArea onChange="areaChange('itens','${item}',this)">${newVal.css.itens.findIndex(e=>e.name == item)>-1?newVal.css.itens[newVal.css.itens.findIndex(e=>e.name == item)].data:""}</textarea>
            </fieldset>`;
        });
        html += "</fieldset>";

        html += `</fieldset><fieldset class="collapsed"><legend onClick="setCollapse(this)">Auto-Resize</legend>`;
        
        localeditlayouts.css.auto = newVal.css.auto;
        newVal.css.auto.forEach((item,i)=>{
            html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item.name}</legend>
            <div class="layoutFormLabelAuto">Tamanho Base: <input type="text" onChange='Set("Auto",${i})' id="Auto${i}Base" value="${item.baseSize}"></div>
            <div class="layoutFormLabelAuto">Minimo: <input type="text" onChange='Set("Auto",${i})' id="Auto${i}Min" value="${item.minSize}"></div>
            <div class="layoutFormLabelAuto">Maximo: <input type="text" onChange='Set("Auto",${i})' id="Auto${i}Max" value="${item.maxSize}"></div>
            <div class="layoutFormLabelAuto"><button onClick='Remove("Auto",${i})'>X</button></div>
            </fieldset>`;
        });
        html += `
        <div class="layoutFormArea">
        <div class="layoutFormLabel">Novo:</div>
        <div class="layoutFormItem">Elemento: <input type="text" onChange='New("Auto")' id="AutoNewName"></div>
        <div class="layoutFormItem">Tamanho Base: <input type="text" onChange='New("Auto")' id="AutoNewBase"></div>
        <div class="layoutFormItem">Minimo: <input type="text" onChange='New("Auto")' id="AutoNewMin"></div>
        <div class="layoutFormItem">Maximo: <input type="text" onChange='New("Auto")' id="AutoNewMax"></div>
        </div>`;
        html += "</fieldset>";

        document.getElementById('Css').innerHTML = html;

    }
}

function SaveLayout(){
    var valid = true;
    console.log(localeditlayouts)
    if(localeditlayouts.new == true){
        if(localLayouts.filter(e=>e.name == localeditlayouts.name).length > 0){
            valid = false;
        }
    }
    if(valid){
        if(localLayouts.filter(e=>e.name == localeditlayouts.name).length > 0){
            console.log("edit",localeditlayouts)
            localLayouts[localLayouts.findIndex(e => e.name == localeditlayouts.name)] = localeditlayouts;
        }
        else{
            console.log("create",localeditlayouts)
            localLayouts.push(localeditlayouts);
        }
        layouts.value = localLayouts;
        ClearLayout();
    }
}

function ClearLayout(){
    editlayouts.value = {
        name:"",
        size:'',
        players:0,
        css:{
            background:"",
            frame:"",
            auto:[],
            players:[],
            itens:[]
        }
    }
}

function New(area){
    if(area == "Auto"){
        var name = document.getElementById('AutoNewName').value;
        var baseSize = parseFloat(document.getElementById('AutoNewBase').value);
        var minSize = parseFloat(document.getElementById('AutoNewMin').value);
        var maxSize = parseFloat(document.getElementById('AutoNewMax').value);
        if(name && baseSize && minSize && maxSize){
            var obj = {
                name,
                baseSize,
                minSize,
                maxSize
            }
            localeditlayouts.css.auto.push(obj);
            editlayouts.value = localeditlayouts;
        }

    }
    else{
        var x = parseInt(document.getElementById(area+'Newx').value);
        var y = parseInt(document.getElementById(area+'Newy').value);
        var bX = parseInt(document.getElementById(area+'NewbX').value);
        var bY = parseInt(document.getElementById(area+'NewbY').value);

        if(x && y && bX && bY){
            var obj = {
                x,
                y,
                bX,
                bY
            }
            switch(area){
                case "Pos":
                    localeditlayouts.positions.push(obj);
                    break;
                case "Track":
                    localeditlayouts.trackers.push(obj);
                    break;
                case "Cam":
                    localeditlayouts.cameras.push(obj);
                    break;
                case "Low":
                    localeditlayouts.lower.push(obj);
                    break;
            }
            editlayouts.value = localeditlayouts;
        }
    }
}
function checkbox(input,area){
    console.log(input)
    localeditlayouts[area] = input.checked;
    editlayouts.value = localeditlayouts;
}
function Set(area,index){
    if(area == "Auto"){
        console.log('Auto'+index+'Name')
        var baseSize = parseFloat(document.getElementById('Auto'+index+'Base').value);
        var minSize = parseFloat(document.getElementById('Auto'+index+'Min').value);
        var maxSize = parseFloat(document.getElementById('Auto'+index+'Max').value);
        if( baseSize && minSize && maxSize){
            var obj = {
                name:localeditlayouts.css.auto[index].name,
                baseSize,
                minSize,
                maxSize
            }
            localeditlayouts.css.auto[index] = obj;
            editlayouts.value = localeditlayouts;
        }

    }
    else{
        var x = parseInt(document.getElementById(area+index+'x').value);
        var y = parseInt(document.getElementById(area+index+'y').value);
        var bX = parseInt(document.getElementById(area+index+'bX').value);
        var bY = parseInt(document.getElementById(area+index+'bY').value);

        if(x && y && bX && bY){
            var obj = {
                x,
                y,
                bX,
                bY
            }
            switch(area){
                case "Pos":
                    localeditlayouts.positions[index] = obj;
                    break;
                case "Track":
                    localeditlayouts.trackers[index] = obj;
                    break;
                case "Cam":
                    localeditlayouts.cameras[index] = obj;
                    break;
                case "Low":
                    localeditlayouts.lower[index] = obj;
                    break;
            }
            editlayouts.value = localeditlayouts;
        }
    }
    
}

function Remove(area,index){
    console.log(localeditlayouts,index)
    switch(area){
        case "Pos":
            localeditlayouts.positions.splice(index, 1);
            break;
        case "Track":
            localeditlayouts.trackers.splice(index, 1);
            break;
        case "Cam":
            localeditlayouts.cameras.splice(index, 1);
            break;
        case "Low":
            localeditlayouts.lower.splice(index, 1);
            break;
        case "Auto":
            localeditlayouts.css.auto.splice(index, 1);
            break;
    }
    editlayouts.value = localeditlayouts;
}

function InputChange(e,field){
    switch(field){
        case "name":
            localeditlayouts.name = e.value;
        break;
        case "size":
            localeditlayouts.size = e.value;
        break;
        case "players":
            if(localeditlayouts.players != e.value){
                var players = []
                for(var i = 0 ; i < localeditlayouts.players ; i++){
                    framesItems.forEach((area)=>{
                        var it = {
                            name: `VideoFrame${i}`+area,
                            data: ""
                        }
                        if(localeditlayouts.css.players){
                            if(localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)]){
                                it = localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)];
                            }
                        }

                        players.push(it);
                    })

                    console.log(players);
                    var areas = ["Nation","Nomes","Twitch"]
                    areas.forEach((area)=>{
                        var it = {
                            name: area+`${i}Div`,
                            data: ""
                        }
                        if(localeditlayouts.css.players){
                            if(localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)]){
                                it = localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)];
                            }
                        }

                        players.push(it);
                    })
                    console.log(players);
                    areas = ["Avatar","Tracker"];
                    areas.forEach((area)=>{
                        var it = {
                            name: area+`${i}`,
                            data: ""
                        }
                        if(localeditlayouts.css.players){
                            if(localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)]){
                                it = localeditlayouts.css.players[localeditlayouts.css.players.findIndex(e=>e.name = it.name)];
                            }
                        }

                        players.push(it);
                    })
    console.log(players);

                }
                if(localeditlayouts.css){
                    localeditlayouts.css.players = players;
                }
            }

            localeditlayouts.players = e.value;
        break;
        default:
            localeditlayouts.css[field] = e.value;

    }
    editlayouts.value = localeditlayouts;
    
}

function setCollapse(e){
    if(e.parentElement.className == 'collapsed'){
        e.parentElement.className = "";
    }else{
        e.parentElement.className = 'collapsed'
    }
}

function areaChange(area,item,e){
    console.log(area,item,e.value);
    console.log(localeditlayouts.css);
    console.log(localeditlayouts.css[area]);
    if(localeditlayouts.css[area].filter(e=>e.name == item).length > 0){
        localeditlayouts.css[area][localeditlayouts.css[area].findIndex(e=>e.name == item)].data= e.value;
    }else{
        var obj = {
            name: item,
            data: e.value
        };
        localeditlayouts.css[area].push(obj);
    }
    editlayouts.value = localeditlayouts;
}

function PrintCss(){
    var html="<textArea>";
    var Div = document.getElementById('Css');
    if(localLayouts){
        localLayouts.forEach(element => {
      if(element.css){
        html += `/*${element.size}*/
.${element.size}{
${element.css.background?`background: url('../graphics/img/${element.css.background}.fw.png');`:""}
}
`;
      element.css.itens.forEach(item => {
        html += `.${element.size} #${item.name}{
${item.data}
}
`;
});
      element.css.players.forEach(item => {
html += `.${element.size} #${item.name}{
${item.data}
}
`;
});
    }
    });
  }
    html +="</textArea>"
    Div.innerHTML = html;
}