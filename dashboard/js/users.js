var bundle = "rbr";
var security = nodecg.Replicant('security',bundle);

var localData;

security.on("change",(newval,oldval)=>{     
    if(newval && newval != oldval){
        localData = newval;
        setup(newval);
    }
});


function setup(newval){
    var html = "<div><div>Login</div><div> Nivel de acesso</div></div><br>"; 
    newval.users.forEach((user,index)=>{
        html += `<div class="userItem"><div>${user.name}</div><div> ${user.level<10?`<input id='User${index}' type='number' max='9' value='${user.level}'>`:`${user.level}`}</div></div>`;
    });
    document.getElementById('Users').innerHTML = html;

    html = "<div><div class='label'>Area</div><div> Nivel de acesso</div></div><br>"; 
    newval.areas.forEach((area,index)=>{
        html += `<div class="areaItem"><div class="label">${area.area}</div><div><input id='Area${index}' type='number' value='${area.access}'><button onClick='Delete("area",${index})'>X</button></div></div>`;
    });
    document.getElementById('Areas').innerHTML = html;
    
}

function Save(){
    localData.users.forEach((user,index)=>{
        
        if(document.getElementById('User'+index)){
            localData.users[index].level = document.getElementById('User'+index).value
        }
    });

    localData.areas.forEach((area,index)=>{
        if(document.getElementById('Area'+index)){
            localData.areas[index].access = document.getElementById('Area'+index).value
        }
    });
    
    security.value = localData;
}

function Delete(area, index){
    if(confirm(`Remover ${area}`)==true){
        localData[area+"s"].splice([index],1);
        security.value = localData;
    }
}