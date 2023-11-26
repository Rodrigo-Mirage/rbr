
var ads = nodecg.Replicant('ads');

ads.on('change', (newVal, oldVal) => {
    if(newVal != oldVal){
        setup(newVal)
    }
    if(!newVal){
        setup([]);
    }
});

function setup(newVal){
    var index = 0;
    var html = "";
    while(newVal[index]){
        html += "<input id='ads"+ index +"' value ='" + newVal[index] + "'/>";
        index++;
    }
    html += "<input id='ads" + index + "' />";
    document.getElementById('ads').innerHTML = html;
}

function Save(){
    var inject = [];
    var index = 0;
    while(document.getElementById('ads'+index)){
        if(document.getElementById('ads'+index).value){
            inject.push(document.getElementById('ads'+index).value);
        }
        index++;
    }
    ads.value = inject;
}