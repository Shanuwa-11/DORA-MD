const fs = require("fs");
const path = require("path");
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, fetchLatestBaileysVersion, Browsers } = require("@whiskeysockets/baileys");
const P = require("pino");
const config = require("./config");
const axios = require("axios");
const { File } = require("megajs");
const { sms, downloadMediaMessage } = require("./lib/msg");
const qrcode = require("qrcode-terminal");

const prefix = config.PREFIX;
const ownerNumber = config.OWNER_NUM;

// Session management: Directory and path for creds.json
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Ensure the session directory exists
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

// Function to download session data
async function downloadSessionData() {
    if (!config.SESSION_ID) {
        console.error('❌ Please set SESSION_ID in environment variables!');
        return false;
    }

    const prefix = "CYBER-DEXTER-MD [KILL]>>>"; // Custom prefix for session ID
    
    // Check if the session ID starts with the specified prefix
    if (config.SESSION_ID.startsWith(prefix)) {
        try {
            // Remove prefix and decode the base64 data
            const base64Data = config.SESSION_ID.slice(prefix.length);
            const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
            
            // Write decoded session data into the creds.json file
            await fs.promises.writeFile(credsPath, decodedData);
            console.log("🔒 Session check and saved successfully!");
            return true;
        } catch (error) {
            console.error('❌ Base64 decode failed:', error.message);
            return false;
        }
    } else {
        console.error('❌ SESSION_ID Re upgrade');
        return false;
    }
}

//===================SESSION-AUTH============================
if (!fs.existsSync(credsPath)) {
    downloadSessionData()
        .then((result) => {
            if (result) {
                console.log("Session setup completed. You can now proceed!");
                connectToWA(); // Connect to WhatsApp after session is saved
            } else {
                console.log("Session setup failed. Please check the SESSION_ID configuration.");
            }
        });
} else {
    connectToWA(); // If session already exists, connect immediately
}

// Function to connect to WhatsApp
async function connectToWA() {
    console.log("Connecting DORA-MD 📌");

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth_info_baileys/");
    var { version } = await fetchLatestBaileysVersion();

    const robin = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version,
    });

    robin.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === "open") {
            console.log(" Installing... ");
            const path = require("path");
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log("*⚕️ᴅᴏʀᴀ 𝙈𝘿-𝙑 1*  *`ᴄᴏɴɴᴇᴄᴛᴇᴅ ‼️`*");
            robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
                image: {
                    url: `https://files.catbox.moe/i5fwv5.jpg`,
                },
                caption: "*⚕️ᴅᴏʀᴀ 𝙈𝘿-𝙑 1*  *`ᴄᴏɴɴᴇᴄᴛᴇᴅ ‼️`*",
            });
        }
    });

    robin.ev.on("creds.update", saveCreds);

    robin.ev.on("messages.upsert", async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;
        mek.message =
            getContentType(mek.message) === "ephemeralMessage"
                ? mek.message.ephemeralMessage.message
                : mek.message;

        const m = sms(robin, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const quoted =
            type == "extendedTextMessage" &&
            mek.message.extendedTextMessage.contextInfo != null
                ? mek.message.extendedTextMessage.contextInfo.quotedMessage || []
                : [];
        const body =
            type === "conversation"
                ? mek.message.conversation
                : type === "extendedTextMessage"
                ? mek.message.extendedTextMessage.text
                : type == "imageMessage" && mek.message.imageMessage.caption
                ? mek.message.imageMessage.caption
                : type == "videoMessage" && mek.message.videoMessage.caption
                ? mek.message.videoMessage.caption
                : "";
        const isCmd = body.startsWith(prefix);
        const command = isCmd
            ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase()
            : "";
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const isGroup = from.endsWith("@g.us");
        const sender = mek.key.fromMe
            ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
            : mek.key.participant || mek.key.remoteJid;
        const senderNumber = sender.split("@")[0];
        const botNumber = robin.user.id.split(":")[0];
        const pushname = mek.pushName || "Sin Nombre";
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;

        // Additional bot functionality (react, auto-typing, etc.) goes here
        if (config.AUTO_TYPING && m.from) {
            robin.sendPresenceUpdate("composing", m.from);
        }

        if (config.AUTO_RECORDING && m.from) {
            robin.sendPresenceUpdate("recording", m.from);
        }

        if (m.from) {
            robin.sendPresenceUpdate(config.ALWAYS_ONLINE ? 'available' : 'unavailable', m.from);
        }

        // Command processing logic
        if (isCmd) {
            const events = require("./command");
            const cmdName = isCmd
                ? body.slice(1).trim().split(" ")[0].toLowerCase()
                : false;
            const cmd =
                events.commands.find((cmd) => cmd.pattern === cmdName) ||
                events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));

            if (cmd) {
                if (cmd.react)
                    robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

                try {
                    cmd.function(robin, mek, m, {
                        from,
                        quoted,
                        body,
                        isCmd,
                        command,
                        args,
                        q,
                        isGroup,
                        sender,
                        senderNumber,
                        botNumber,
                        pushname,
                        isMe,
                        isOwner,
                        reply: (text) => {
                            robin.sendMessage(from, { text: text }, { quoted: mek });
                        },
                    });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    res.send("hey, *DORA-MD 🌚* STARTED ✅");
});

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});

setTimeout(() => {
    connectToWA();
}, 4000);
