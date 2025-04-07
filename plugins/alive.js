const { cmd, commands } = require('../command');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["ravi", "robo"],
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
            package: 'RAVI MD 🎉'
        }, { quoted: mek });

        return await robin.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝗥𝗔𝗩𝗜 𝗜𝗗 𝗦𝗘𝗡𝗗",
                    newsletterJid: "120363286758767913@newsletter"
                },
                externalAdReply: {
                    title: "𝐊ɪɴɢ  𝐑ᴀᴠɪ  𝐌ᴅ  𝐖ᴀ  𝐁ᴏᴛ 💕",
                    body: "ᴀ 𝗥𝗔𝗩𝗜 ᴍᴅ ᴡᴀ ʙᴏᴛ ʙᴇꜱᴇᴅ ᴏɴ ʙᴀɪʏʟᴇꜱ",
                    sourceUrl: 'https://youtube.com/@ravimodz?si=UR4LRZYq3e7iuLm8',
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
