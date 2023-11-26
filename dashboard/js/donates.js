
var donates = nodecg.Replicant('donates');
var input = document.getElementById('DonateValue');

donates.on('change', (newVal, oldVal) => {
    if(oldVal && newVal != oldVal){
        setup(newVal)
    }
});


NodeCG.waitForReplicants(donates).then(() => {
    setup(donates.value)
});

function setup(newVal){
    input.value = newVal;
}

function update(){
    donates.value = input.value;  
}