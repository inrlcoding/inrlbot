/* codded by afnanplk
*/

const { Sequelize } = require('sequelize');
const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// PLK Special Functions
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
 PLKAFN: process.env.BAD_WORDS === undefined ? false : process.env.BAD_WORDS,
 BUTTON: process.env.BUTTON_TEXT === undefined ? false : process.env.BUTTON_TEXT,
 WEBPREVIEW: process.env.FAKE_PREVIEW === undefined ? false : process.env.FAKE_PREVIEW,
 PHONE: process.env.NUMBER === undefined ? '917025099161' : process.env.NUMBER,   
 OA_NAME: process.env.DEPLOYER === undefined ? 'undefined' : process.env.DEPLOYER,    
 THUMBNAIL: process.env.THUMBNAIL_URL === undefined ? 'https://i.imgur.com/xsKCqwZ.jpeg' : process.env.THUMBNAIL_URL,
 VERIFY: process.env.VERIFICATION_CAPTION === undefined ? '[inrl Bot]\nCoded by @FASWEEH-KT' : process.env.VERIFICATION_CAPTION,
 INRLPW: process.env._INRL_BOT_ACSESS_PASSWORD === undefined ? false : process.env._INRL_BOT_ACSESS_PASSWORD,
};
