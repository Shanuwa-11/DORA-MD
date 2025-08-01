const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "system",
    alias: ["system"],
    desc: "Check uptime and system status",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `*⇆ ʜɪɪ ᴍʏ ᴅᴇᴀʀ ғʀɪᴇɴᴅ ⇆*

     *${pushname}*, am alive 
*╭─────────────···▸*
*┋▸* *ɴᴀᴍᴇ ʙᴏᴛ* : *🥀ᴅᴏʀᴀ ᴍᴅ 🥀*
*┋▸* *ʀᴜɴᴛɪᴍᴇ* : ${runtime(process.uptime())}
*┋▸* *ʜᴏsᴛɴᴀᴍᴇ* : *[${os.hostname()}]*
*┋▸* *ʀᴀᴍ ᴜsᴇ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*┋*
*╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷*

> > © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴏʀᴀ ᴍᴅ`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/i5fwv5.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363306168354073@newsletter',
                    newsletterName: 'Mʀ ᴅᴏʀᴀ ᴍᴅ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in system command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
