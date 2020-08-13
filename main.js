const tiBotVersion = "1.6"
const Discord = require('discord.js')
const client = new Discord.Client()
var request = require('request')
var watchr = require('watchr')
const http = require('http');
const fs = require('fs');
const fetch = require("node-fetch");

const bot_token = "Njk5MDQwNTg3NDE1ODE0MTU1.Xq7hYA.2PFHIlAoHejIwEeBkLYdejUwrLI"

var tchatHandler = require('./tchatHandler')

const channel_log = '706970986842554468'

var lastMessage = 'ok'
var lastPseudo = 'ok'

var cookieJar = request.jar();

client.on('ready', () => {

     //client.user.setActivity("!tibot help || by Wistaro")
     client.user.setStatus("available")
     console.log("TI Bot is ready! v4")

     
     var cookieJar = request.jar();

     request.post({ //first request to login
       url: 'https://tiplanet.org/forum/ucp.php?mode=login',
       form: {
       username:'WistaBot_NOP',
       password:'93215942!',
       autologin:'on',
       viewonline:'on',
       redirect:'/forum/chat',
       login:'Connexion'
       },
       jar: cookieJar
     
     }, function(err, httpResponse, body) {
       if (!err) {
     
         console.log('Connexion effectuée.\n')
     
         request.post({
           url: 'https://tiplanet.org/forum/chat/?ajax=true',
     
           form: {
             channelName: 'Public',
             text: ''
           },
     
           jar: cookieJar
     
         }, function(err, httpResponse, body) {
           if (!err) {
     
             console.log("message envoyé!")
     
           } else {
             console.log("error" + err)
           }
         })
     
       } else {
         console.log("error" + err)
       }
     })


})

function updateLastMessage(lastMessage, lastPseudo) {

    var lastDataFromFile =  fs.readFileSync('lastMessage.log', 'utf8');
            
        tchatHandler.getTchatXml(lastDataFromFile).then(function(response){
    
            if(response['pseudo'] != 'NO_DATA'){

                console.log('response main : pseudo'+response['pseudo']+' || msg : '+response['message'])

                var prefix = ''

                switch (response['userRole']) {
                  case '121':
                    prefix = '[PREMIUM]';
                    break;

                  case '42':
                    prefix = '[MOD+]';
                    break; 
                  
                  case '53':
                    prefix = '[ADMIN]';
                    break;    
                  
                  case '4':
                    prefix = '[BOT]';
                    break; 
                
                  default:
                    prefix = '';
                    break;
                }

            request.post('https://discordapp.com/api/webhooks/708351218388435015/PWLB31ajkbpSuGMV9HF55VBdq0v7SRMzOKEuOC8wvfz8Ya_lsuDI2lTmoL1DcbYW3f2C', {
                json: {
                    content: response['message'], 
                    username : prefix+' '+response['pseudo'],
                    avatar_url : 'https://tiplanet.org/forum/avatar.php?id='+response['userId']

                }
            }, (error, res, body) => {
    
                if (error) {
    
                     console.error(error)
    
                }
            })

        }

        })
            

}
function getLastData(){
    return lastMessage;
} 

function updateLastData(msg){
    return lastMessage = msg;
} 

function messageUpdater(){
    updateLastMessage(lastMessage, lastPseudo)
}
setInterval(messageUpdater, 1000); 

client.on("guildCreate", guild => {
    //guild.owner.send('Thanks! You can use **!covid help** to discover commands.\n \n By Wistaro#9487')
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 });

 client.on("guildDelete", guild => {
    console.log(`Guild kick the bot: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
 });

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) {
        return
    }
    
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) 
    let splitCommand = fullCommand.split(" ") 
    let primaryCommand = splitCommand[0] 
    let arguments = splitCommand.slice(1) 

    let serverGuild = receivedMessage.guild;

    let memberWhoSpeak = receivedMessage.author.username;

    if(fullCommand == 'debug'){
        creceivedMessage.channel.send("test")
    }

}

function login2Tiplanet(){

}

function sendMessage(title, message){

    const embed = new Discord.RichEmbed()

    .setAuthor("Wistaro")
    .setColor("#EF1616")
    .setFooter("By Wistaro#9487", "https://i.imgur.com/yMtrkBo.png")
    //.setThumbnail("https://www.shareicon.net/data/256x256/2017/06/21/887490_logo_512x512.png")
    .setTitle(title)
    .setDescription(message)

    client.channels.get(channel_log).send({embed})
}


client.login(bot_token) 

