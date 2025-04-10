const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers,
} = require("@whiskeysockets/baileys");

const l = console.log;
const fs = require("fs");
const path = require("path");
const P = require("pino");
const config = require("./config");
const qrcode = require("qrcode-terminal");
const { sms, downloadMediaMessage } = require("./lib/msg");
const axios = require("axios");
const { File } = require("megajs");

const prefix = config.PREFIX;
const ownerNumber = config.OWNER_NUM;

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

// Ensure the session directory exists
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
  if (!config.SESSION_ID) {
    console.error('❌ Please set SESSION_ID in environment variables!');
    return false;
  }

  const prefix = "DORA-MD [KILL]>>>";

  if (config.SESSION_ID.startsWith(prefix)) {
    try {
      const base64Data = config.SESSION_ID.slice(prefix.length);
      const decodedData = Buffer.from(base64Data, 'base64').toString('utf-8');
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

// Download session data if required
downloadSessionData();

async function connectToWA() {
  console.log("Connecting DORA-MD 📌");
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

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
    console.log("Connection update:", connection, lastDisconnect);

    if (connection === "close") {
      if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
        console.log("Reconnecting...");
        connectToWA(); // Try reconnecting
      }
    } else if (connection === "open") {
      console.log("Bot connected successfully!");
      
      // Load plugins
      const path = require("path");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          require("./plugins/" + plugin);
        }
      });

      // Send welcome messages
      let up = "*⚕️ᴅᴏʀᴀ 𝙈𝘿-𝙑 1*  *`ᴄᴏɴɴᴇᴄᴛᴇᴅ ‼️`*";
      let up1 = "*𝙃𝙀𝙇𝙇𝙊 ᴅᴏʀᴀ ᴍᴅ* *`ᴅᴏʀᴀ-ᴍᴅ ᴘᴏᴡᴇʀ ꜰᴜʟʟ ʙᴏᴛ 📌`*";
      

      robin.sendMessage(ownerNumber + "@s.whatsapp.net", {
        image: {
          url: `https://files.catbox.moe/i5fwv5.jpg`,
        },
        caption: up,
      });
      robin.sendMessage("94743454928@s.whatsapp.net", {
        image: {
          url: `https://files.catbox.moe/i5fwv5.jpg`,
        },
        caption: up1,
      });
    }
  });

  robin.ev.on("creds.update", saveCreds);

  robin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = getContentType(mek.message) === "ephemeralMessage"
      ? mek.message.ephemeralMessage.message
      : mek.message;

    const m = sms(robin, mek);
    const type = getContentType(mek.message);
    const body = type === "conversation"
      ? mek.message.conversation
      : type === "extendedTextMessage"
      ? mek.message.extendedTextMessage.text
      : type === "imageMessage" && mek.message.imageMessage.caption
      ? mek.message.imageMessage.caption
      : type === "videoMessage" && mek.message.videoMessage.caption
      ? mek.message.videoMessage.caption
      : "";

    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(" ").shift().toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");

    const from = mek.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const sender = mek.key.fromMe
      ? robin.user.id.split(":")[0] + "@s.whatsapp.net" || robin.user.id
      : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];

    const reply = (teks) => {
      robin.sendMessage(from, { text: teks }, { quoted: mek });
    };

    // Handle commands
    if (isCmd) {
      const events = require("./command");
      const cmdName = body.slice(1).trim().split(" ")[0].toLowerCase();
      const cmd = events.commands.find((cmd) => cmd.pattern === cmdName) ||
        events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));

      if (cmd) {
        if (cmd.react)
          robin.sendMessage(from, { react: { text: cmd.react, key: mek.key } });

        try {
          cmd.function(robin, mek, m, {
            from,
            quoted: mek,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            reply,
          });
        } catch (e) {
          console.error("[PLUGIN ERROR] " + e);
        }
      }
    }
  });
}

// Initialize Express server
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("hey, *DORA-MD 🌚* STARTED ✅");
});

app.listen(port, () =>
  console.log(`Server listening on port http://localhost:${port}`)
);

// Start the WhatsApp connection
setTimeout(() => {
  connectToWA();
}, 4000);
