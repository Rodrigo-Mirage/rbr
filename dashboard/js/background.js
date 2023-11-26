var fundoInfo = nodecg.Replicant('BackgroundData');
var setupInfo = nodecg.Replicant('SetupData');
var mainInfo = nodecg.Replicant('MainData');
var editfundoInfo = nodecg.Replicant('BackgroundDataEdit');
var localsetup = {};
var localmain = {};
var localLayouts = {};
var localeditlayouts = {};

var BaseLayouts = [
    {
        name:"Default",
        html:"",
        css:""
    }
];

mainInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localmain = newVal;
    }
    if(!newVal && !oldVal){
        var test = BaseLayouts[0];
        test.runs = 0;
        test.name = "Main";
        mainInfo.value = test;
    }
});

setupInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localsetup = newVal;
    }
    if(!newVal && !oldVal){
        var test = BaseLayouts[0];
        test.runs = 0;
        test.name = "Setup";
        setupInfo.value = test;
    }
});

fundoInfo.on("change", (newVal, oldVal) => {
    
    if(newVal && newVal != oldVal){
        localLayouts = newVal;
    }
    if(!newVal && !oldVal){
        var test = BaseLayouts[0];
        test.runs = 0;
        test.name = "Fundo";
        fundoInfo.value = test;
    }
});

editfundoInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        localeditlayouts = newVal;
        setupEdit(newVal)
    }
});


function NewLayout(){
    var obj = {
        name:"",
        html:'',
        css:"",
        new:true
    }
    editfundoInfo.value = obj;

}

function Edit(name){
    switch(name){
        case "Setup":
            var toEdit = localsetup;
            toEdit.new = false;
            editfundoInfo.value = toEdit;
            break;
        case "Main":
            var toEdit = localmain;
            toEdit.new = false;
            editfundoInfo.value = toEdit;
            break;
        case "Fundo":
            var toEdit = localLayouts;
            toEdit.new = false;
            editfundoInfo.value = toEdit;
            break;
    }
}

function Clone(name){
    if(localLayouts.filter(e=>e.name == name)){
        var toEdit = runData = JSON.parse(JSON.stringify(localLayouts.filter(e=>e.name == name)[0]));
        toEdit.name = ""
        toEdit.new = true;
        editfundoInfo.value = toEdit;
    }
}
function Delete(name){
    if(confirm(`Deletar o background ${name}?`) == true){
        localLayouts.splice(localLayouts.findIndex(e => e.name == name),1);
        fundoInfo.value = localLayouts;
    }
}


function setupEdit(newVal){
    if(document.getElementById('EditForm')){
        document.getElementById('EditName').value = newVal.name;
        document.getElementById('EditHTML').value = newVal.html;
        document.getElementById('EditCSS').value = newVal.css;
        var html = "";
        if(newVal.name == "Setup"){
            html +=`<span>Proximas Runs:</span><div><input onChange="InputChange(this,'runs')" type="number" value="${newVal.runs}"></div>` ;
        }
        document.getElementById('ExtraData').innerHTML = html;
        
        if(newVal.name != ""){
            document.getElementById('EditName').setAttribute("disabled", "");
        }else{
            document.getElementById('EditName').removeAttribute("disabled")
        }
    }
}

function SaveLayout(){
    var valid = true;


    switch(localeditlayouts.name){
        case "Setup":
            setupInfo.value = localeditlayouts;
            ClearLayout();
            break;
        case "Main":
            mainInfo.value = localeditlayouts;
            ClearLayout();
            break;
        case "Fundo":
            fundoInfo.value = localeditlayouts;
            ClearLayout();
            break;
    }
}

function ClearLayout(){
    localeditlayouts.value = {
        name:"",
        html:"",
        css:""
    }
}

function InputChange(e,field){
    localeditlayouts[field] = e.value;
    editfundoInfo.value = localeditlayouts;
}

if(document.getElementById('List')){
    var html = "";
    html +=`<div class='ListItem'>
        <div class="ItemName"><span>Setup</span></div>
        <button class='greenBtn' nodecg-dialog="editBackground" onClick='Edit("Setup")'>Edit</button></div>`;
    html +=`<div class='ListItem'>
        <div class="ItemName"><span>Main</span></div>
        <button class='greenBtn' nodecg-dialog="editBackground" onClick='Edit("Main")'>Edit</button></div>`;
    html +=`<div class='ListItem'>
        <div class="ItemName"><span>Fundo</span></div>
        <button class='greenBtn' nodecg-dialog="editBackground" onClick='Edit("Fundo")'>Edit</button></div>`;

    document.getElementById('List').innerHTML = html;
}
