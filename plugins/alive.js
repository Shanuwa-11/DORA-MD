const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["dora", "robo"],
    react: "🔥",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, reply }) => {
    try {  
        await robin.sendPresenceUpdate('recording', from); 
        
        await robin.sendMessage(from, { 
            audio: { url: "https://files.catbox.moe/kkyhmt.mp3" }, 
            mimetype: 'audio/mpeg', 
            ptt: true 
        }, { quoted: mek });

        await robin.sendMessage(from, { 
            sticker: { url: "https://raw.githubusercontent.com/CYBER-DEXTER-MD-BOT/KING-RAVI-DATA-BASE/refs/heads/main/ezgif.com-webp-maker.webp" },
            package: 'DORA MD 🎉'
        }, { quoted: mek });

        return await robin.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "DORA 𝗜𝗗 𝗦𝗘𝗡𝗗",
                    newsletterJid: "120363286758767913@newsletter"
                },
                externalAdReply: {
                    title: "Dᴏʀᴀ Mᴅ Wᴀ ʙᴏᴛ💕",
                    body: "Dᴏʀᴀ Mᴅ Wᴀ ʙᴏᴛ ʙᴇꜱᴇᴅ ᴏɴ ʙᴀɪʏʟᴇꜱ",
                    sourceUrl: 'https://youtube.com/@dora_official894?si=z56mdnS_gcp9uc05',
                    thumbnailUrl: 'https://i.ibb.co/rf0tq33W/IMG-20250216-WA0007.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
