var layouts = nodecg.Replicant('layouts');
var editlayouts = nodecg.Replicant('editLayouts');
var localLayouts = {};
var localeditlayouts = {};

var itemsBaseList =[
    "Timer",
    "System",
    "Category",
    "Estimate",
    "Game",
    "Host",
    "Couch"
];

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
    }
    if(newVal == null && oldVal == null){
        layouts.value = BaseLayouts;
    }
});

function setup(newVal){
    if(document.getElementById('List')){
        var html = "";
        html  += `<button id='newLayout' 
        class="nodecg-configure" nodecg-dialog="editLayouts" 
        onClick='NewLayout()'>Novo Layout</button>`;
        newVal.forEach(element => {
            html +=`<div class='ListItem'>
            <div class="ItemName"><span>${element.name}</span></div>
            <button class='greenBtn' nodecg-dialog="editLayouts" onClick='Edit("${element.name}")'>Edit</button>
            <button class='greenBtn'  nodecg-dialog="editLayouts" onClick='Clone("${element.name}")'>Clone</button>
            <button class='redBtn'  nodecg-dialog="delete" onClick='Delete("${element.name}")'>Delete</button></div>`;
        });
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
        cameras:[],
        positions:[],
        trackers:[],
        lower:[],
        new:true
    }
    obj.css = baseCss(css);
    editlayouts.value = obj;

}

function Edit(name){
    if(localLayouts.filter(e=>e.name == name)){
        var toEdit = runData = JSON.parse(JSON.stringify(localLayouts.filter(e=>e.name == name)[0]));
        if(!toEdit.css){
            toEdit.css = baseCss(toEdit);
        }
        toEdit.new = false;
        editlayouts.value = toEdit;
        console.log(toEdit)
    }
}

function Clone(name){
    if(localLayouts.filter(e=>e.name == name)){
        var toEdit = runData = JSON.parse(JSON.stringify(localLayouts.filter(e=>e.name == name)[0]));
        if(!toEdit.css){
            toEdit.css = baseCss(toEdit);
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
        var it = {
            name: "pos"+(i+1),
            data: ""
        }
        obj.players.push(it);
    }
    return obj;
}

var BaseLayouts = [
    {
        name:"solo169",
        size:'s169',
        players:1,
        cameras:[
            {
                x:16,
                y:16,
                bX:307,
                bY:226
            }
        ],
        positions:[
            {
                x:360,
                y:22,
                bX:1537,
                bY:855
            }
        ],
        trackers:[
            {
                x:27,
                y:278,
                bX:291,
                bY:530
            }
        ],
        lower:[]
    },
    {
        name:"solo43",
        size:'s43',
        players:1,
        cameras:[
            {
                x:7,
                y:123,
                bX:324,
                bY:217
            }
        ],
        positions:[
            {
                x:638,
                y:17,
                bX:1265,
                bY:947
            }
        ],
        trackers:[
            {
                x:122,
                y:469,
                bX:411,
                bY:419
            }
        ],
        lower:[]
    },
    {
        name:"solo3DS",
        size:'s43',
        players:1,
        cameras:[
            {
                x:16,
                y:16,
                bX:309,
                bY:233
            }
        ],
        positions:[
            {
                x:347,
                y:21,
                bX:1542,
                bY:855
            }
        ],
        trackers:[
            {
                x:26,
                y:523,
                bX:291,
                bY:530
            }
        ],
        lower:[
            {
                x:16,
                y:244,
                bX:309,
                bY:233
            }
        ]
    },
    {
        name:"soloGBC",
        size:'s109',
        players:1,
        cameras:[
            {
                x:116,
                y:16,
                bX:461,
                bY:233
            }
        ],
        positions:[
            {
                x:738,
                y:13,
                bX:1166,
                bY:1056
            }
        ],
        trackers:[
            {
                x:122,
                y:509,
                bX:446,
                bY:430
            }
        ],
        lower:[
        ]
    },
    {
        name:"duoGBA",
        size:'s43',
        players:2,
        cameras:[],
        positions:[
            {
                x:11,
                y:85,
                bX:942,
                bY:614
            },
            {
                x:972,
                y:85,
                bX:942,
                bY:614
            }
        ],
        trackers:[
            {
                x:34,
                y:779,
                bX:654,
                bY:285
            },
            {
                x:1232,
                y:779,
                bX:654,
                bY:285
            }
        ],
        lower:[]
    },
    {
        name:"duo43",
        size:'s43',
        players:2,
        cameras:[],
        positions:[
            {
                x:11,
                y:19,
                bX:942,
                bY:699
            },
            {
                x:972,
                y:19,
                bX:942,
                bY:699
            }
        ],
        trackers:[],
        lower:[]
    },
    {
        name:"quad43",
        size:'s43',
        players:4,
        cameras:[],
        positions:[
            {
                x:5,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:5,
                y:540,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:540,
                bX:715,
                bY:535
            }
        ],
        trackers:[
            {
            x:731,
            y:110,
            bX:291,
            bY:171
            },
            {
            x:731,
            y:582,
            bX:291,
            bY:171
            },
            {
            x:904,
            y:283,
            bX:291,
            bY:171
            },
            {
            x:904,
            y:787,
            bX:291,
            bY:171
            }
        ],
        lower:[]
    },
    {
        name:"quadArquipelago",
        size:'s43',
        players:4,
        cameras:[],
        positions:[
            {
                x:5,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:5,
                y:540,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:5,
                bX:715,
                bY:535
            },
            {
                x:1200,
                y:540,
                bX:715,
                bY:535
            }
        ],
        trackers:[],
        lower:[]
    }
];

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
        localeditlayouts = newVal;
        setupEdit(newVal)
    }
});

function setupEdit(newVal){
    if(document.getElementById('EditForm')){
        document.getElementById('Name').value = newVal.name;
        if(newVal.name != ""){
            document.getElementById('Name').setAttribute("disabled", "");
        }else{
            document.getElementById('Name').removeAttribute("disabled")
        }
        document.getElementById('Size').value = newVal.size;
        document.getElementById('Players').value = newVal.players;
        var html = '';
        newVal.positions.forEach((element,i)=>{
            html += `<div class="layoutFormArea">
            <div class="layoutFormLabel">${i+1}:</div>
            <div class="layoutFormItem">Posição X: <input type="number" onChange='Set("Pos",${i})' id="Pos${i}x" value="${element.x}"></div>
            <div class="layoutFormItem">Posição Y: <input type="number" onChange='Set("Pos",${i})' id="Pos${i}y" value="${element.y}"></div>
            <div class="layoutFormItem">Largura: <input type="number" onChange='Set("Pos",${i})' id="Pos${i}bX" value="${element.bX}"></div>
            <div class="layoutFormItem">Altura: <input type="number" onChange='Set("Pos",${i})' id="Pos${i}bY" value="${element.bY}"></div>
            <div class="layoutFormLabel"><button onClick='Remove("Pos",${i})'>X</button></div>
            </div>`;
        })
        html += `<div class="layoutFormArea">
        <div class="layoutFormLabel">Novo:</div>
        <div class="layoutFormItem">Posição X: <input type="number" onChange='New("Pos")' id="PosNewx"></div>
        <div class="layoutFormItem">Posição Y: <input type="number" onChange='New("Pos")' id="PosNewy"></div>
        <div class="layoutFormItem">Largura: <input type="number" onChange='New("Pos")' id="PosNewbX"></div>
        <div class="layoutFormItem">Altura: <input type="number" onChange='New("Pos")' id="PosNewbY"></div>
        </div>`;
        document.getElementById('Positions').innerHTML = html;

        html = '';
        newVal.trackers.forEach((element,i)=>{
            html += `<div class="layoutFormArea">
            <div class="layoutFormLabel">${i+1}:</div>
            <div class="layoutFormItem">Posição X: <input type="number" onChange='Set("Track",${i})' id="Track${i}x" value="${element.x}"></div>
            <div class="layoutFormItem">Posição Y: <input type="number" onChange='Set("Track",${i})' id="Track${i}y" value="${element.y}"></div>
            <div class="layoutFormItem">Largura: <input type="number" onChange='Set("Track",${i})' id="Track${i}bX" value="${element.bX}"></div>
            <div class="layoutFormItem">Altura: <input type="number" onChange='Set("Track",${i})' id="Track${i}bY" value="${element.bY}"></div>
            <div class="layoutFormLabel"><button onClick='Remove("Track",${i})'>X</button></div>
            </div>`;
        })
        html += `<div class="layoutFormArea">
        <div class="layoutFormLabel">Novo:</div>
        <div class="layoutFormItem">Posição X: <input type="number" onChange='New("Track")' id="TrackNewx"></div>
        <div class="layoutFormItem">Posição Y: <input type="number" onChange='New("Track")' id="TrackNewy"></div>
        <div class="layoutFormItem">Largura: <input type="number" onChange='New("Track")' id="TrackNewbX"></div>
        <div class="layoutFormItem">Altura: <input type="number" onChange='New("Track")' id="TrackNewbY"></div>
        </div>`;
        document.getElementById('Trackers').innerHTML = html;

        html = '';
        newVal.cameras.forEach((element,i)=>{
            html += `<div class="layoutFormArea">
            <div class="layoutFormLabel">${i+1}:</div>
            <div class="layoutFormItem">Posição X: <input type="number"  onChange='Set("Cam",${i})' id="Cam${i}x" value="${element.x}"></div>
            <div class="layoutFormItem">Posição Y: <input type="number"  onChange='Set("Cam",${i})' id="Cam${i}y" value="${element.y}"></div>
            <div class="layoutFormItem">Largura: <input type="number" onChange='Set("Cam",${i})'  id="Cam${i}bX" value="${element.bX}"></div>
            <div class="layoutFormItem">Altura: <input type="number"  onChange='Set("Cam",${i})' id="Cam${i}bY" value="${element.bY}"></div>
            <div class="layoutFormLabel"><button onClick='Remove("Cam",${i})'>X</button></div>
            </div>`;
        })
        html += `<div class="layoutFormArea">
        <div class="layoutFormLabel">Novo:</div>
        <div class="layoutFormItem">Posição X: <input type="number" onChange='New("Cam")' id="CamNewx"></div>
        <div class="layoutFormItem">Posição Y: <input type="number" onChange='New("Cam")' id="CamNewy"></div>
        <div class="layoutFormItem">Largura: <input type="number" onChange='New("Cam")' id="CamNewbX"></div>
        <div class="layoutFormItem">Altura: <input type="number" onChange='New("Cam")' id="CamNewbY"></div>
        </div>`;
        document.getElementById('Cameras').innerHTML = html;

        html = '';
        newVal.lower.forEach((element,i)=>{
            html += `<div class="layoutFormArea">
            <div class="layoutFormLabel">${i+1}:</div>
            <div class="layoutFormItem">Posição X: <input type="number" onChange='Set("Low",${i})' id="Low${i}x" value="${element.x}"></div>
            <div class="layoutFormItem">Posição Y: <input type="number" onChange='Set("Low",${i})' id="Low${i}y" value="${element.y}"></div>
            <div class="layoutFormItem">Largura: <input type="number" onChange='Set("Low",${i})' id="Low${i}bX" value="${element.bX}"></div>
            <div class="layoutFormItem">Altura: <input type="number" onChange='Set("Low",${i})' id="Low${i}bY" value="${element.bY}"></div>
            <div class="layoutFormLabel"><button onClick='Remove("Low",${i})'>X</button></div>
            </div>`;
        })
        html += `<div class="layoutFormArea">
        <div class="layoutFormLabel">Novo:</div>
        <div class="layoutFormItem">Posição X: <input type="number" onChange='New("Low")' id="LowNewx"></div>
        <div class="layoutFormItem">Posição Y: <input type="number" onChange='New("Low")' id="LowNewy"></div>
        <div class="layoutFormItem">Largura: <input type="number" onChange='New("Low")' id="LowNewbX"></div>
        <div class="layoutFormItem">Altura: <input type="number" onChange='New("Low")' id="LowNewbY"></div>
        </div>`;
        document.getElementById('Lowers').innerHTML = html;
        
        document.getElementById('Players').value = newVal.players;

        html = "<option>Selecione</option>";
        frameList.forEach((frame)=>{
            html += `<option value='${frame.name}' ${newVal.css.background==frame.name?"selected":""}>${frame.name}</option>`;
        });
        document.getElementById('Background').innerHTML = html;

        html = '<fieldset class="collapsed"><legend onClick="setCollapse(this)">Players</legend>';
        for(var i=0 ; i < newVal.players;i++){
            var item = 'pos'+(i+1);            
            html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">Pos${i+1}</legend>
            <textArea onChange="areaChange('players','pos${i+1}',this)">${newVal.css.players.findIndex(e=>e.name == item)>-1?newVal.css.players[newVal.css.players.findIndex(e=>e.name == item)].data:""}</textarea>
            </fieldset>`;
        }
        html += `</fieldset><fieldset><legend onClick="setCollapse(this)">Infos</legend>`;
        itemsBaseList.forEach((item)=>{
            html += `<fieldset class="collapsed"><legend onClick="setCollapse(this)">${item}</legend>
            <textArea onChange="areaChange('itens','${item}',this)">${newVal.css.itens.findIndex(e=>e.name == item)>-1?newVal.css.itens[newVal.css.itens.findIndex(e=>e.name == item)].data:""}</textarea>
            </fieldset>`;
        });
        html += "</fieldset>";

        html += `</fieldset><fieldset><legend onClick="setCollapse(this)">Auto-Resize</legend>`;
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
    if(localeditlayouts.new){
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
        cameras:[],
        positions:[],
        trackers:[],
        lower:[],
        css:{
            background:"",
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
            localeditlayouts.players = e.value;
        break;
        case "background":
            localeditlayouts.css.background = e.value;
        break;
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
        html += `/*${element.name}*/
.${element.name}{
${element.css.background?`background: url('../graphics/img/${element.css.background}.fw.png');`:""}
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
    html +="</textArea>"
    Div.innerHTML = html;
}