'use strict';

var CryptoJS = require("crypto-js");
const { Client, IntentsBitField, PermissionsBitField } = require('discord.js');



class security {
    constructor(nodecg){
        let namespace = 'portal';
        const salt = "";
        let key  = CryptoJS.enc.Hex.parse("rbrRando");
        let iv   = CryptoJS.enc.Hex.parse("17c69b41b5fe49aaa984e472d4aeaa5a");

        let security = nodecg.Replicant("security");
        
        const base = {
            areas:[
                {
                    v:"rbr_users",
                    access:9
                }
            ],
            users : [
                {
                    login: "admin",
                    password: "VTwo0kSNS/f8gozaC0ltsA==",//rbr4dm1n
                    level: 10
                }
            ]
        };
        let localData = base;

        security.on("change",(newval,oldval)=>{     
            if(!newval){
                security.value = base;
            }else{
                localData = newval;
            }
        });

        nodecg.listenFor(`${namespace}:access`, async (data, callback) => {
            const rules = await getUserRoles(data.du);
            
            if(rules){

                var level = 0;

                localData.users.forEach(user =>{
                    if(user.id){
                        if(rules.find(r=>r.id == user.id))
                        {
                            if(level<user.level){
                                level = user.level
                            }
                        }
                    }
                })

                var access = [];
                localData.areas.forEach(area =>{
                    if(parseInt(area.access) <= level){
                        access.push(area.area);
                    }
                })
                if(level>9){
                    access.push("rbr_users");
                    access.push("assets");
                }
                nodecg.log.warn(`Usuario:${data.du} Level:${level}`)
                callback({err:"",access:access});
            }else{
                nodecg.log.warn(`Usuario:${data.du} Level:${level}`)
                callback({err:"Usuario deslogado",access:false});
            }
        });

        nodecg.listenFor(`${namespace}:change`, (data, callback) => {
            var decrypt = JSON.parse(CryptoJS.AES.decrypt(data.token, key, {iv: iv}).toString(CryptoJS.enc.Utf8));
            const i = localData.users.findIndex(e=>e.login == decrypt.login && e.level == decrypt.level)
            if(localData.users[i].password == CryptoJS.AES.encrypt(data.oldpassword, key, {iv: iv}).toString()){         
                localData.users[i].password = CryptoJS.AES.encrypt(data.newpassword, key, {iv: iv}).toString();
                security.value = localData;
                callback({err:"Senha Trocada"});
            }else{
                callback({err:"Senha errada"});
            }
        });

        nodecg.listenFor(`${namespace}:areas`, (data, callback) => {

            if(data){
                data.list.forEach(element => {
                    if(localData.areas.findIndex(e=>e.area == element)<0){
                        localData.areas.push({area:element, access:9})
                    }
                });
                security.value = localData;
            }
           
        });
        //DISCORD

        const discordData = nodecg.Replicant(`DiscordData`);

        security.value.users.forEach((e,i)=>{
            if(e.name == "Administradores"){
                e.level = 10;
            }
            if(e.name == "Ger. Transmissões"){
                e.level = 10;
            }
        });

        discordData.on('change', (newVal, oldVal) => {
            if(!newVal){
                discordData.value = [];
            }
        });

        var blackList = [
            "859824510029922304",
            "719475309929300011"
        ];

        const Discordclient = new Client({ intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildPresences,
            IntentsBitField.Flags.GuildVoiceStates
        ] })
        const DiscordToken = "NDY4MTg1NTMyNzExNTY3Mzcw.G8V8Cs.gLSPXH23mZcxF_4Y88peeyyKjEis_dZLlsmrFw";
        const channel = "865946383823405086"
        const guild = "836946808068112405"
        Discordclient.on("ready", () => {
            console.log(`Logged in as ${Discordclient.user.tag}!`)
        })

        Discordclient.on("voiceStateUpdate", async (oldMember, newMember) => {
            let newUserChannel = newMember.channelId
            let oldUserChannel = oldMember.channelId
            
            if(newUserChannel === channel) {
                // User Joins a voice channel
                //var user = Discordclient.users.fetch(newUserChannel.id)
                const user = await Discordclient.users.fetch(newMember.id);
                manageUser("enter",user);
            }
            if(oldUserChannel === channel) {
                // User Joins a voice channel
                const user = await Discordclient.users.fetch(oldMember.id);
                manageUser("exit",user);
            }
        })
        Discordclient.login(DiscordToken)

        function manageUser(type,user){
            if(!blackList.includes(user.id)){
                switch(type){
                    case "enter":
                        console.log(user.globalName+" entrou na Sala Ao Vivo");
                        discordData.value.push({name:user.globalName,avatar:`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`})
                    break;
                    case "exit":
                        console.log(user.globalName+" saiu da Sala Ao Vivo");
                        discordData.value.splice(discordData.value.findIndex((e)=>{return e.name == user.globalName}),1)
                    break;
                }
            }
        }

        async function getRules(){
            const Guild = await Discordclient.guilds.fetch(guild);
            const roles = await Guild.roles.fetch();
            roles.forEach(role => {
                if(security.value.users.filter(e=>e.id == role.id).length == 0){
                    security.value.users.push({name:role.name,id: role.id,level:1})
                }
            });
        };

        getRules();

        async function getUserRoles  (id) {
            const user = await Discordclient.users.fetch(id);
            const Guild = await Discordclient.guilds.cache.find((guilds) =>guilds.id == guild);

            const members = await Guild.members.cache.find(member=>{
                return user.id == member.user.id
            });
            var roles = [];
            members.roles.cache.find((member) => {
                roles.push({id:member.id,name:member.name});
            });
            return roles;
        };
    }

}

module.exports = security;