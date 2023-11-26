
var Pokemon = nodecg.Replicant('Pokemon');


Pokemon.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        nodecg.readReplicant("singleRun",'rbr', (pkData) => {
            var PokemonDiv = document.getElementById("PokemonDiv");
            if(PokemonDiv){
                if(pkData.layout == "fir"){
                    setup(newVal);
                    PokemonDiv.classList.remove("hidden");
                }else{
                    PokemonDiv.classList.add("hidden");
                }
                
            }
        })
    }
});

function setup(newVal){
    console.log(newVal)
    var pkmnE = document.getElementById("PokemonE");
    var pkmnD = document.getElementById("PokemonD");
    if(pkmnE && pkmnD && newVal){
        injectPkmn(pkmnE,pkmnD,newVal)
    }

}

function injectPkmn(divE,divD,data){
    var htmlE ="";
    var htmlD ="";
    htmlE+=`<div class="pkmnImg"><img src="./img/pokemon/${data.TrainerE["Number"]?data.TrainerE["Number"]:"201"}.png" /></div>`;
    htmlD+=`<div class="pkmnImg"><img src="./img/pokemon/${data.TrainerD["Number"]?data.TrainerD["Number"]:"201"}.png" /></div>`;

    htmlE+=`<div class="status type">`;
    htmlD+=`<div class="status type">`;

    if(data.TrainerE["Type 1"]!=""){
        htmlE+=`<img src="./img/pokemon/types/${data.TrainerE["Type 1"].toLowerCase()}.png" />`;
    }else{
        htmlE+=`<img src="./img/pokemon/types/${"normal".toLowerCase()}.png" />`;
    }
    
    if(data.TrainerD["Type 1"]!=""){
        htmlD+=`<img src="./img/pokemon/types/${data.TrainerD["Type 1"].toLowerCase()}.png" />`;
    }else{
        htmlD+=`<img src="./img/pokemon/types/${"normal".toLowerCase()}.png" />`;
    }

    if(data.TrainerE["Type 2"]!=""){
        htmlE+=`<img src="./img/pokemon/types/${data.TrainerE["Type 2"].toLowerCase()}.png" />`;
    }
    if(data.TrainerD["Type 2"]!=""){
        htmlD+=`<img src="./img/pokemon/types/${data.TrainerD["Type 2"].toLowerCase()}.png" />`;
    }

    htmlE+=`</div>`;
    htmlD+=`</div>`;
    htmlE+=`<div class="statusDiv">`;
    htmlD+=`<div class="statusDiv">`;


    htmlE+=`<div class="stats ${data.TrainerE["HP"]>=data.TrainerD["HP"]?"best":""}">HP: <span>${data.TrainerE["HP"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["HP"]<=data.TrainerD["HP"]?"best":""}">HP: <span>${data.TrainerD["HP"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Attack"]>=data.TrainerD["Attack"]?"best":""}">Atk: <span>${data.TrainerE["Attack"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Attack"]<=data.TrainerD["Attack"]?"best":""}">Atk: <span>${data.TrainerD["Attack"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Defense"]>=data.TrainerD["Defense"]?"best":""}">Def: <span>${data.TrainerE["Defense"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Defense"]<=data.TrainerD["Defense"]?"best":""}">Def: <span>${data.TrainerD["Defense"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Sp. Atk"]>=data.TrainerD["Sp. Atk"]?"best":""}">S. Atk: <span>${data.TrainerE["Sp. Atk"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Sp. Atk"]<=data.TrainerD["Sp. Atk"]?"best":""}">S. Atk: <span>${data.TrainerD["Sp. Atk"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Sp. Def"]>=data.TrainerD["Sp. Def"]?"best":""}">S. Def: <span>${data.TrainerE["Sp. Def"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Sp. Def"]<=data.TrainerD["Sp. Def"]?"best":""}">S. Def: <span>${data.TrainerD["Sp. Def"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Speed"]>=data.TrainerD["Speed"]?"best":""}">Spd: <span>${data.TrainerE["Speed"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Speed"]<=data.TrainerD["Speed"]?"best":""}">Spd: <span>${data.TrainerD["Speed"]}</span> </div>`;


    htmlE+=`<div class="stats ${data.TrainerE["Total"]>=data.TrainerD["Total"]?"best":""}">BST: <span>${data.TrainerE["Total"]}</span> </div>`;
    htmlD+=`<div class="stats ${data.TrainerE["Total"]<=data.TrainerD["Total"]?"best":""}">BST: <span>${data.TrainerD["Total"]}</span> </div>`;



    htmlE+=`</div>`;
    htmlD+=`</div>`;

    divE.innerHTML = htmlE;
    divD.innerHTML = htmlD;
}
