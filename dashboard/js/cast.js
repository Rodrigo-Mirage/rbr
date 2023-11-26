
var castInfo = nodecg.Replicant('castInfo');
var hostVar="";
var couchVar="";

castInfo.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        setCast(newVal)
    }
});

function newHost(e) {
    hostVar = e.value;
}
function newCast(e) {
    couchVar = e.value;
}

function saveCastRep(){
    castInfo.value = {
        host:hostVar,
        couch:couchVar
    };
}

function setCast(newVal){
    var Host = document.getElementById('Host');
    var Couch = document.getElementById('Couch');
  
    if(Host){ Host.value = newVal.host;}
    hostVar = newVal.host;
    if(Couch){Couch.value = newVal.couch;}
    couchVar= newVal.couch;
}