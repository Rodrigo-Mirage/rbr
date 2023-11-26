var css = nodecg.Replicant('css');

css.on("change", (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
    }
});


var localCss = [
    {
        name:"soloDS",
        background:"FRAME_3DS_SOLO",
        itens:[
            {
                name:"Timer",
                data:`
                top: 394px;
                left: 347px;
                width: 259px;
                height: 48px;
                font-size: 50px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            },
            {
                name:"System",
                data:`
                top: 315px;
                left: 60px;
                width: 400px;
                height: 74px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                display: none;
                `
            },
            {
                name:"Category",
                data:`
                top: 293px;
                left: 343px;
                width: 266px;
                height: 74px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            },
            {
                name:"Estimate",
                data:`
                top: 315px;
                left: 60px;
                width: 480px;
                height: 74px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                display: none;
                `
            },
            {
                name:"Game",
                data:`
                top: 195px;
                left: 345px;
                width: 263px;
                height: 51px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            },
            {
                name:"Host",
                data:`
                top: 847px;
                left: 792px;
                width: 400px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            },
            {
                name:"Couch",
                data:`
                top: 795px;
                left: 790px;
                width: 400px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            }
        ],
        players:[
            {
                name:"pos1",
                data:`
                top: 317px;
                left: 69px;
                width: 236px;
                height:50px;
                text-shadow: 2px 2px #000;
                display: flex;
                justify-content: center; 
                align-items: center; 
                `
            },
        ],
        auto: [
            {
                name:".pos1",
                baseSize:15,
                minSize:1,
                maxSize:2
            },
            {
                name:"#Game",
                baseSize:15,
                minSize:0.8,
                maxSize:1.7
            },
            {
                name:"#Category",
                baseSize:15,
                minSize:0.8,
                maxSize:1.7
            }
        ]
    }
];


css.value = localCss;
