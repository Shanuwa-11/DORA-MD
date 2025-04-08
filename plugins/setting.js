const { cmd } = require('../command');
const config = require('../config');

const imageUrls = [
    "https://i.ibb.co/6cwfF95R/5903da768358.jpg",
    "https://i.ibb.co/6cwfF95R/5903da768358.jpg",
    "https://i.ibb.co/6cwfF95R/5903da768358.jpg"
];

function getRandomImageUrl() {
    if (imageUrls.length === 0) throw new Error("https://files.catbox.moe/20f3gw.jpg");
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    return imageUrls[randomIndex];
}

cmd({
    pattern: "settings",
    react: "⚙️",
    alias: ["setting", "env"],
    desc: "Displays the current bot settings.",
    category: "main",
    use: ".settings",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const randomImageUrl = getRandomImageUrl();

        const madeSetting = `
╔════════════════════╗
    🌟 *BOT SETTINGS* 🌟
╚════════════════════╝

🔧 *Auto Read Status:* ${config.AUTO_READ_STATUS}
🔧 *Mode:* ${config.MODE}
🔧 *Auto Voice:* ${config.AUTO_VOICE}
🔧 *Auto Sticker:* ${config.AUTO_STICKER}
🔧 *Auto Reply:* ${config.AUTO_REPLY}
🔧 *Anti-Link:* ${config.ANTI_LINK}
🔧 *Anti-Bad Words:* ${config.ANTI_BAD}
🔧 *Prefix:* [${config.PREFIX}]
🔧 *Fake Recording:* ${config.FAKE_RECORDING}
🔧 *Auto React:* ${config.AUTO_REACT}
🔧 *Heart React:* ${config.HEART_REACT}
🔧 *Owner React:* ${config.OWNER_REACT}
🔧 *Bot Name:* ${config.BOT_NAME}

✨ _Powered by DORA MD_
╚═══════════════════════╝`;

       
        await conn.sendMessage(
            from,
            {
                image: { url: randomImageUrl },
                caption: madeSetting
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("Error fetching settings:", e);
        await reply("⚠️ *Unable to display settings. Please try again later.*");
    }
});
