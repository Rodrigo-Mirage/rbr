
'use strict';
const { Client, IntentsBitField, PermissionsBitField } = require('discord.js');

class discord {
    constructor(nodecg){

        const discordData = nodecg.Replicant(`DiscordData`);

        let security = nodecg.Replicant("security");

        security.value.users.forEach((e,i)=>{
            if(e.name == "Administradores"){
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

        nodecg.listenFor(`getUserRoles`,"rbr", async (data, callback) => {
            const user = await Discordclient.users.fetch(data.id);
            const Guild = await Discordclient.guilds.cache.find((guilds) =>guilds.id == guild);

            const members = await Guild.members.cache.find(member=>{
                return user.id == member.user.id
            });
            var roles = [];
            members.roles.cache.find((member) => {
                roles.push({id:member.id,name:member.name});
            });
            callback(roles);
        });
    }
}

module.exports = discord;