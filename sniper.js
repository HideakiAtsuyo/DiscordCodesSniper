const Discord = require("discord.js"),
    client = new Discord.Client(),
    fetch = require("node-fetch"),
    chalk = require('chalk'),
    conf = require("./config.json"),
    logswebhook = new Discord.WebhookClient(conf.webhookid, conf.webhooktoken);

try {
    client.login(conf.token);
} catch {
    console.log(chalk.red("TOKEN INVALID"));
    process.exit(-1)
}

client.on("ready", () => {
    var memberCount = client.users.size,
        servercount = client.guilds.size,
        memberNumber = client.users.size,
        serverNumber = client.guilds.size;

    console.log("Ready to Auto-Claim Discord Gifts: " + client.user.tag);
    if (conf.viewguilds == true) {
        //var servers = client.guilds.array().map(g => g.name).join('\n');
        var servers = client.guilds.map(r => "Nom: " + r.name + ` | Membres: ${r.memberCount} | ID: ${r.id}\n`);
        console.log('--> ' + (chalk.yellow('Auto-Claim Gifts')) + ' \n--> ' + (chalk.green('Logged in with success ')) + ' \n--> ' + (chalk.blue('Tag Bot:               ')) + `[ ${client.user.tag} ]` + ' \n--> ' + (chalk.red('Number of Users: ')) + `[ ${client.users.size} ]` + '\n--> ' + (chalk.red('Number of Channels:          ')) + `[ ${client.channels.size} ]` + '\n--> ' + (chalk.red('Guilds:    ')) + `[ ${client.guilds.size} ]\n\n` + (chalk.blue(`Guilds List: \n[ ` + (chalk.red(`${servers}`)) + `]\n`)));
    } else {
        console.log('--> ' + (chalk.yellow('Auto-Claim Gifts')) + ' \n--> ' + (chalk.green('Logged in with success ')) + ' \n--> ' + (chalk.blue('Tag Bot:               ')) + `[ ${client.user.tag} ]` + ' \n--> ' + (chalk.red('Number of Users: ')) + `[ ${client.users.size} ]` + '\n--> ' + (chalk.red('Number of Channels:          ')) + `[ ${client.channels.size} ]` + '\n--> ' + (chalk.red('Guilds:    ')) + `[ ${client.guilds.size} ]\n\n`);
    }

})

function webhook(codetoclaim, validorno) {
    logswebhook.send(`code ${validorno} : ${codetoclaim}`)
}

function matchCode(text, callback) {
    let codes = text.match(/discord\.gift\/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+/);
    if (codes) {
        callback(codes[0]);
        return matchCode(text.slice(codes.index + codes[0].length), callback);
    } else {
        callback(null);
    }
}
client.on("message", message => {
    let codes = [];
    matchCode(message.content, (code) => {
        if (!code) return
        if (!codes.includes(code)) codes.push(code)
    });
    if (codes.length == 0) return;
    codes.forEach(code => {
        fetch("https://canary.discord.com/api/v6/entitlements/gift-codes/" + code.split("/").pop() + "/redeem", {
            method: "post",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US",
                "Authorization": client.token,
                "Connection": "keep-alive",
                "Content-Length": JSON.stringify({
                    channel_id: message.channel.id
                }).length,
                "Content-Type": "application/json",
                "Host": "canary.discord.com",
                "Referer": `https://canary.discord.com/channels/${message.channel.id}/${message.id}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                "X-super-properties": Buffer.from(JSON.stringify({
                    "os": "Windows",
                    "browser": "Firefox",
                    "device": "",
                    "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0",
                    "browser_version": "66.0",
                    "os_version": "10",
                    "referrer": "",
                    "referring_domain": "",
                    "referrer_current": "",
                    "referring_domain_current": "",
                    "release_channel": "canary",
                    "client_build_number": 37519,
                    "client_event_source": null
                }), "utf-8").toString("base64")
            },
            body: JSON.stringify({
                channel_id: message.channel.id
            })
        }).then(res => {
            if (res.status == 400 || res.status == 404) webhook(code, "invalid"); return console.log(chalk.red("code invalid: ") + chalk.blue(code));
            res.json().then(json => {
                if (conf.consolelogjson == true) {

                    if (conf.postwebhook == true) {
                        webhook(code, "valid");
                        console.log(chalk.white(json));
                        console.log(chalk.greenBright("code valid: ") + chalk.blue(code));
                    } else {
                        console.log(chalk.white(json));
                        console.log(chalk.greenBright("code valid: ") + chalk.blue(code));
                    }
                } else {
                    if (conf.postwebhook == true) {
                        webhook(code, "valid");
                        console.log(chalk.greenBright("code valid: ") + chalk.blue(code));
                    } else {
                        console.log(chalk.greenBright("code valid: ") + chalk.blue(code));
                    }
                }
            });
        }).catch(console.error);
    })
})
