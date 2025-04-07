const { cmd, commands } = require('../command');
const config = require('../config'); // Config file එකකින් owner number එක ගන්න

cmd({
    pattern: "owner",
    desc: "Owner contact information",
    category: "main",
    react: "👨‍💻",
    filename: __filename
},

async (conn, mek, m, { from, quoted, reply }) => {
    try {
        let ownerNumber = config.ownerNumber || "94757660788"; // Cost එකෙන් ගන්න
        let dec = `*🔥 𝗥𝗔𝗩𝗜 𝗠𝗗 🔥*

> *𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢* 

*⚡ ᴏᴡɴᴇʀ ɴᴀᴍᴇ -:* ᴋɪɴɢ ʀᴀᴠɪ ᴍᴅ (ᴋɪɴɢ ʀᴀᴠɪʏᴀ)
*⚡ ɴᴜᴍʙᴇʀ -:* wa.me/${ownerNumber}
*⚡ ʏᴏᴜᴛᴜʙᴇ -:* 
*⚡ ᴡʜᴀᴛꜱᴀᴘᴘ ᴄʜᴀɴɴᴇʟ -:* 

*© RAVI-𝐌𝐃 ʙʏ ravi ᴛᴇᴄʜ*`;

        let imageUrl = "https://i.ibb.co/TMD34v5Z/2f5ab376dae4.jpg"; // Owner image URL

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: dec,
            contextInfo: {
                quotedMessage: mek.message,
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363286758767913@newsletter',
                    newsletterName: '𝗥𝗔𝗩𝗜 𝗜𝗗 𝗦𝗘𝗡𝗗"',
                    serverMessageId: 143,
                },
            },
        }, { quoted: mek });

        
        let vCard = `BEGIN:VCARD
VERSION:3.0
FN:KING RAVI
ORG:Sahas Tech
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+94 ${ownerNumber.slice(2)}
EMAIL:sahas.tech@example.com
URL:https://www.youtube.com/@Sahas_Tech
END:VCARD`;

        await conn.sendMessage(from, {
            contacts: {
                displayName: "𝗥𝗔𝗩𝗜 𝗠𝗗 𝗢𝗪𝗡𝗘𝗥",
                contacts: [{ vcard: vCard }]
            },
            contextInfo: {
                quotedMessage: mek.message,
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363286758767913@newsletter',
                    newsletterName: '𝗥𝗔𝗩𝗜 𝗜𝗗 𝗦𝗘𝗡𝗗"',
                    serverMessageId: 143,
                },
            },
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
