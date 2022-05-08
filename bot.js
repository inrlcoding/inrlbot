/* Copyright (C) 2020 Yusuf Usta.
RECODDED BY fasweeh
inrl
*/

const os = require("os");
const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const simpleGit = require('simple-git');
const {WAConnection, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./inrl/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const git = simpleGit();
const faz = require('./faz');
const axios = require('axios');

const Language = require('./language');
const Lang = Language.getString('updater');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login information updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Asena')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please wait.')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing external plugins...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️  Installing plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        fs.readdirSync('./database/PLUGINS').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./database/PLUGINS/' + plugin);
            }
        });

        console.log(
            chalk.blueBright.italic('✅ Plugins Installed...')
        );

// ==================== Password Checking ====================

        console.log(
            chalk.blueBright.italic('❐ Password Checking↻')
        );
        if (faz.INRLPW == 'inrl' || faz.INRLPW == 'faz' || faz.INRLPW == 'fasweeh') {
        //Coded by INRL
        console.log(
            chalk.green.bold('✅PASSWORD DONE...\n☞ 𝚅𝚒𝚛𝚞𝚜 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙴𝚗𝚊𝚋𝚕𝚎𝚍...')
        );
         }
         else if (faz.INRLPW !== 'inrl' || faz.INRLPW !== 'faz' || faz.INRLPW !== 'fasweeh') {
         console.log(
            chalk.red.bold('❌PASSWORD INCORRECT...\n☞ 𝚅𝚒𝚛𝚞𝚜 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍...'));
         }

// ==================== End Check ====================

        console.log(
            chalk.green.bold('✅ inrl-Bot working!'));
 conn.on("close", (e) => console.log(e.reason))

  await groupMuteSchuler(conn)
  await groupUnmuteSchuler(conn)
  await customMessageScheduler(conn)

  conn.on("chat-update", (m) => {
    if (!m.hasNewMessage) return
    if (!m.messages && !m.count) return
    const { messages } = m
    const all = messages.all()
    handleMessages(all[0], conn)
  })

  try {
    await conn.connect()
  } catch (e) {
    if (!nodb) {
      console.log(chalk.red.bold("Eski sürüm stringiniz yenileniyor..."))
      conn.loadAuthInfo(Session.deCrypt(config.SESSION))
      try {
        await conn.connect()
      } catch (e) {
        return
      }
    } else console.log(`${e.message}`)
  }
}

;(async () => {
  await prepareGreetingMedia()
  whatsAsena(await waWebVersion())
})()
