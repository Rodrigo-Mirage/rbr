// set cookie according to you
var cookieName  = "concent";
var cookieValue = "ok";
var cookieExpireDays= 30;
// when users click accept button
let acceptCookie= document.getElementById("acceptCookie");
var sponsors = nodecg.Replicant('assets:sponsors');
acceptCookie.onclick= function(){
    createCookie(cookieName, cookieValue, cookieExpireDays);
}
// function to set cookie in web browser
 let createCookie= function(cookieName, cookieValue, cookieExpireDays){
  let currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + (cookieExpireDays*24*60*60*1000));
  let expires = "expires=" + currentDate.toGMTString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  if(document.cookie){
    document.getElementById("cookiePopup").style.display = "none";
  }else{
    alert("Unable to set cookie. Please allow all cookies site from cookie setting of your browser");
  }
 }
 // function to set cookie in web browser
 let eraseCookie= function(cookieName){
    let currentDate = new Date();
    currentDate.setTime(currentDate.getTime());
    let expires = "expires=" + currentDate.toGMTString();
    document.cookie = cookieName + "=++;" + expires + ";path=/";
    if(document.cookie){
      document.getElementById("cookiePopup").style.display = "none";
    }else{
      alert("Unable to set cookie. Please allow all cookies site from cookie setting of your browser");
    }
   }
// get cookie from the web browser
let getCookie= function(cookieName){
  let name = cookieName + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
// check cookie is set or not
let checkCookie= function(){
    let check=getCookie(cookieName);
    if(check==""){
        document.getElementById("cookiePopup").style.display = "block";
    }else{
        
        document.getElementById("cookiePopup").style.display = "none";
    }
}

function access(){
    let du = getCookie('du');  
    if(du){
        nodecg.sendMessage('portal:access', {
            du:du
        },ret=>{
            if(ret.access){
                hide(ret.access)
                return;
            }
        });
    }
}

function hide(list){
    if(list){
        var pages = window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#pages");
        var header = window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#header");
        var menuDir = header.querySelector("#mainToolbar").children[3];
        var tabs = header.querySelector("#mainToolbar").children[2];

        var children = Array.from(pages.children);

        var elementsList = [];
        children.forEach(page=>{
            if(page.children[0].shadowRoot){
                if(page.children[0].shadowRoot.querySelector("#panels")){
                    var innerChild = Array.from(page.children[0].shadowRoot.querySelector("#panels").children);
                    innerChild.forEach(element=>{
                        if(element.id){
                            if(element.id != "rbr_security"){
                                elementsList.push(element.id)
                                if(list.indexOf(element.id)>-1){
                                    element.classList.remove("hidden");
                                }
                            }else{
                                element.classList.remove("hidden");
                            }
                        }
                    });
                }
            }
        });
        nodecg.sendMessage('portal:areas', {
            list:elementsList
        });
        if(list.indexOf("assets")<0){
            menuDir.classList.remove("hidden");
        }

        var childrenTabs = Array.from(tabs.children);
        childrenTabs.forEach(tab=>{
            tab.classList.remove("hidden");
        });

    }else{
        var pages = window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#pages");
        var children = Array.from(pages.children);
        children.forEach(page=>{
            if(page.children[0].shadowRoot){
                if(page.children[0].shadowRoot.querySelector("#panels")){
                    var innerChild = Array.from(page.children[0].shadowRoot.querySelector("#panels").children);
                    innerChild.forEach(element=>{
                        if(element.id){
                            if(element.id== "rbr_security"){
                                element.classList.remove("hidden");
                            }
                        }
                    });
                }
            }
        });

        var header = window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("#header"); 
        

        var tabs = header.querySelector("#mainToolbar").children[2];
        var menuDir = header.querySelector("#mainToolbar").children[3];

        if(menuDir){
            menuDir.classList.add("hidden");
    
            var childrenTabs = Array.from(tabs.children);
            childrenTabs.forEach(tab=>{
                if(tab.innerHTML.indexOf("login")>-1){
                    tab.classList.remove("hidden");
                }
            });
        }else{
            
        var childrenTabs = Array.from(window.parent.document.getElementById(`nodecg_dashboard`).shadowRoot.querySelector("iron-selector.list").children);
            childrenTabs.forEach(tab=>{
                if(tab.href){
                    if(tab.href.indexOf("login")<0){
                        tab.classList.add("hidden");
                    }
                }
            });
        }

    }
}

function logout(){
    eraseCookie("token")
    parent.location.reload(true);
}

function change(){    
    
    let token = getCookie('token');
    nodecg.sendMessage('portal:change', {
        token:token,
        oldpassword: document.getElementById('OldPass').value,
        newpassword: document.getElementById('NewPass').value
    },ret=>console.log(ret));
    parent.location.reload(true);
}

access();

checkCookie();


sponsors.on('change', (newVal, oldVal) => {
    if(newVal && newVal != oldVal){
        spinerSponsors(newVal);
    }
});

function spinerSponsors(newVal){
    console.log(newVal)
}
