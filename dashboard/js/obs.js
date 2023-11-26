var obsSettings = nodecg.Replicant('obs:websocket');
const ipElement = document.getElementById('ipElement');
const portElement = document.getElementById('portElement');
const passwordElement = document.getElementById('passwordElement');

const formElement = document.getElementById('form');

obsSettings.on('change', (newVal, oldVal) => {
    load(newVal);
    if(newVal.status != "connected"){
        connected = false;
        dimm(false);
    }else{
        connected = true;
        dimm(true);
    }
});		

var ip = "";
var port = "";
var password = "";
var connected = true;

function connect(){
    nodecg.sendMessage('obs:connect', {
        ip: ipElement.value,
        port: portElement.value,
        password: passwordElement.value
    }, err => {
        if (err) {
            console.error(err);
            return;
        }
    });

    obsSettings.value = {
        ip:ipElement.value,
        port: portElement.value,
        password: passwordElement.value,
        status:'connecting'
    }

}

function disconnect(){
    nodecg.sendMessage('obs:disconnect');
}

function load(newVal) {
    ipElement.value = newVal.ip;
    portElement.value = newVal.port;
    passwordElement.value = newVal.password;

    ip = newVal.ip;
    port = newVal.port;
    password = newVal.password;
}

function dimm(status){
    if(status){
        formElement.className = "off";
        ipElement.readOnly = true;
        portElement.readOnly = true;
        passwordElement.readOnly = true;
    }else{
        formElement.className = "on";
        ipElement.readOnly = false;
        portElement.readOnly = false;
        passwordElement.readOnly = false;
    }
}

