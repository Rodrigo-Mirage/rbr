
var layoutList = nodecg.Replicant("trackerTemplaters");
var fileDiv = document.getElementById("file");
var localList;

layoutList.on("change", (newVal,oldVal)=>{
    if(newVal){
       var html = "";
       for(var i = 0; i<newVal.length ; i++){
        html += `<div>${newVal[i].name}</div>
        <button id="btnCadastrar" onclick="removeLayout('${newVal[i].name}')">Remove</button> 
        <button id="btnCadastrar" onclick="downloadPack('${newVal[i].name}')">Download</button> `
       }
       var change = document.getElementById('List');
       change.innerHTML = html;
       localList = newVal;
    }
});


function New(){
    var form = document.getElementById('frmUploader');
    var data = new FormData( form );

    var btn = document.getElementById('btnCadastrar');
    btn.innerHTML = "Carregando"
    btn.disabled = true;
    
    data.append("path","rbr");
    $.ajax( {
        url: '/uploadTrackerPack',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: addLayout,
        error: console.log
      } );
}

function addLayout(e){
    console.log(e)
    if(e){
        if(localList && localList != {}){
            if(localList.indexOf(e) == -1){
                localList.push(e);
            }
        }else{
            localList = [e];
        }

        layoutList.value = localList;

        var btn = document.getElementById('btnCadastrar');
        btn.innerHTML = "Cadastrar"
        btn.disabled = false;
    }
}

function removeLayout(name){
    if(confirm("Deseja remover o pacote: "+name+"?")){
        var form = document.getElementById('frmUploader');
        var data = new FormData();
        data.append("path","rbr");
        data.append("name",name);
        $.ajax( {
            url: '/removeTrackerPack',
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            success: ()=>{
                if(localList.findIndex(e=>e.name == name) != -1){
                    localList.splice(localList.findIndex(e=>e.name == name),1)
                }
                layoutList.value = localList;
            }
          } );
        
    }
}

function downloadPack(name){
    var file = "/bundles/rbr/pacotes/" + name+"/"+name+".zip";
    window.open(file);
}
