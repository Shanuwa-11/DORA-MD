/*
PROJECT NAME : DORA-MD
*/


const config = require('../config');


const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    alias: ["about"],
    react: "🧠",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let madeMenu = `╔═══════════════════════════════

*👋 ʜᴇʟʟᴏ ᴜsᴇʀ ${pushname}*\n\n *ᴅᴏʀᴀ-ᴍᴅ*\n\n
  𝙸 𝙰𝙼 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙰𝚂𝙴𝙳 𝙼𝚄𝙻𝚃𝙸 𝙳𝙴𝚅𝙸𝙲𝙴  𝙱𝙾𝚃 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 ᴅᴏʀᴀ 𝙼𝙳 𝙵𝚁𝙾𝙼 𝚂𝚁𝙸 𝙻𝙰𝙽𝙺𝙰.\n
𝙼𝚈 𝚂𝙾𝙻𝙴 𝙿𝚄𝚁𝙿𝙾𝚂𝙴 𝙸𝚂 𝚃𝙾 𝚁𝙴𝙼𝙾𝚅𝙴 𝚃𝙷𝙴 𝙱𝚄𝚁𝙳𝙴𝙽 𝙾𝚁 𝙲𝙾𝚂𝚃 𝙾𝙵 𝙿𝚄𝚁𝙲𝙷𝚄𝚂𝙸𝙽𝙶 𝙳𝙰𝚃𝙰 𝙱𝚄𝙽𝙳𝙻𝙴 𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚂𝙾𝙽𝙶 𝚊𝚗𝚍 𝙰𝙿𝙿𝚂 & 𝚅𝙸𝙳𝙴𝙾𝚂 𝚊𝚗𝚍 𝙼𝙾𝚅𝙸𝙴𝚂 𝙱𝚈 𝚄𝚂𝙸𝙽𝙶 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝚄𝙽𝙳𝙻𝙴𝚂.
\n\n *𝙵𝙾𝚁 𝙼𝙾𝚁𝙴 𝙸𝙽𝙵𝙾𝚁 𝚅𝙸𝚂𝙸𝚃*
╔═══════════════════════════════

> *OWNER'S WHATSAPP* : https://wa.me/+94757660788?text=*ʜᴇʟʟᴏ_ʀᴀᴠɪ_💥🕊️*

> *FOLLOW OWNER YT* : https://youtube.com/@ravimodz?si=WNmuGRMldYHyJD41


> *OWNER'S WHATSAPP* : https://wa.me/+94789958225?text=*ʜᴇʟʟᴏ_ᴅᴇxᴛᴇʀ_💥🕊️*


> *FOLLOW OWNER YT* : https://youtube.com/@dextertools999?si=yGXCmebe8trO1mMo


> *OWNER'S WHATSAPP* :https://wa.me/+94785274495?text=*ʜᴇʟʟᴏ_ᴄʏʙᴇʀ_ᴅᴇxᴛᴇʀ_💥🕊️*


> *FOLLOW OWNER YT* : https://youtube.com/@techcyberdexter_dz?si=m73pqdhuHQK5kcl_


> *OWNER'S WHATSAPP* :https://wa.me/+94743454928?text=*ʜᴇʟʟᴏ_ᴅᴏʀᴀ_


> *FOLLOW OWNER YT* : https://youtube.com/@dora_official894?si=z56mdnS_gcp9uc05

> *RELEASE DATE* - *999+ ᴊᴀɴᴜᴀʀʏ 2025*
 

> * ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴏʀᴀ ᴍᴅ*

╚═══════════════════════════════
`

await conn.sendMessage(
            from,
            {
                image: { url: `https://i.ibb.co/QvdZstvD/f73f31950bc3e339547c677500298471.jpg` },
                caption: madeMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363286758767913@newsletter',
                        newsletterName: '*_🕊️⃝ 𝓚 ɪɴɢ ᴅᴏʀᴀ-ᴍᴅ_* ',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send audio //https://github.com/kingmalvn/KING-DATA/raw/refs/heads/main/autovoice/menu.mp3
        await conn.sendMessage(from, { //https://github.com/kingmalvn/KING-DATA/raw/refs/heads/main/autovoice/menu.mp3
            audio: { url: 'https://github.com/kingmalvn/KING-DATA/raw/refs/heads/main/autovoice/menu.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
