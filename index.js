const discord = require("discord.js")
const client = new discord.Client()
const fetch = require("node-fetch")
const chalk = require('chalk');
const conf = require("./config.json")
client.login(conf.token)
client.on("ready", () => {
    var memberCount = client.users.size;
    var servercount = client.guilds.size;
    var memberNumber = client.users.size;
    var serverNumber = client.guilds.size;
    
    //var servers = client.guilds.array().map(g => g.name).join('\n');
    var servers = client.guilds.map(r => "Nom: " + r.name + ` | Membres: ${r.memberCount} | ID: ${r.id}\n`);

    console.log("Prêt à accepter des nitro: " + client.user.tag)
    console.log('--> ' + (chalk.yellow('Auto-Claim Nitro')) +' \n--> ' + (chalk.green('Connecté avec succès  ')) + ' \n--> ' + (chalk.blue('Tag Bot:               '))+ `[ ${client.user.tag} ]` + ' \n--> '+ (chalk.red('Nombre d\'utilisateurs: ')) + `[ ${client.users.size} ]` + '\n--> '+ (chalk.red('Nombre salon:          ')) + `[ ${client.channels.size} ]` + '\n--> '+ (chalk.red('Nombre de serveurs:    ')) + `[ ${client.guilds.size} ]\n\n\n` + (chalk.blue( `Les serveurs: \n[ ` + (chalk.red(`${servers}`)) + `]`)));

})
function matchCode(text, callback){
    //let codes = text.match(/https:\/\/discord\.gift\/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+/)
    let codes = text.match(/discord\.gift\/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+/)//Pour claim également les codes ne contenant pas le "https://"
    if(codes){
        callback(codes[0])
        return matchCode(text.slice(codes.index+codes[0].length), callback)
    }else{
        callback(null)
    }
}
client.on("message", message => {
    let codes = []
    matchCode(message.content, (code) => {
        if(!code)return
        if(!codes.includes(code))codes.push(code)
    })
    if(codes.length == 0)return
    codes.forEach(code => {
        //fetch("https://canary.discordapp.com/api/v6/entitlements/gift-codes/"+code.split("/").pop()+"/redeem", {
        fetch("https://discordapp.com/api/v6/entitlements/gift-codes/"+code.split("/").pop()+"/redeem", {
            method: "post",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US",
                "Authorization": client.token,
                "Connection": "keep-alive",
                "Content-Length": JSON.stringify({channel_id: message.channel.id}).length,
                "Content-Type": "application/json",
                //"Host": "canary.discordapp.com",
                "Host": "discordapp.com",
                //"Referer": `https://canary.discordapp.com/channels/${message.channel.id}/${message.id}`,
                "Referer": `https://discordapp.com/channels/${message.channel.id}/${message.id}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                "X-super-properties": Buffer.from(JSON.stringify({
                    "os":"Windows",
                    "browser":"Firefox",
                    "device":"",
                    "browser_user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                    "browser_version":"66.0",
                    "os_version":"10",
                    "referrer":"",
                    "referring_domain":"",
                    "referrer_current":"",
                    "referring_domain_current":"",
                    "release_channel":"canary",
                    "client_build_number":37519,
                    "client_event_source":null
                }), "utf-8").toString("base64")
            },
            body: JSON.stringify({channel_id: message.channel.id})
        }).then(res => {
            if(res.status == 400 || res.status == 404)return console.log(chalk.red("code invalide: ") +chalk.blue(code));
            res.json().then(json => {
                if(conf.consolelogjson == true){
                console.log(chalk.white(json));
                console.log(chalk.greenBright("code invalide: ") +chalk.blue(code));
                } else {
                    console.log(chalk.greenBright("code invalide: ") +chalk.blue(code));
                }
            })
        }).catch(console.error);
    })
})
