const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

cmd({
  pattern: "movie",
  desc: "Search Sinhala Subtitle and send file",
  category: "utility",
  react: "📥",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    const movieName = args.join(" ");
    if (!movieName) return reply("🎬 *Please enter a movie name!*\n_Example: .movie Interstellar_");

    const searchUrl = `https://www.sinhalsub.com/?s=${encodeURIComponent(movieName)}`;
    const searchRes = await axios.get(searchUrl);
    const $ = cheerio.load(searchRes.data);
    const firstResult = $('.post-title a').first();
    const link = firstResult.attr('href');

    if (!link) return reply("❌ Sinhala subtitle not found.");

    const postRes = await axios.get(link);
    const $$ = cheerio.load(postRes.data);
    const downloadLink = $$('a[href$=".srt"], a[href$=".zip"]').first().attr('href');

    if (!downloadLink) return reply("❌ Subtitle file not found in post.");

    const fileExt = path.extname(downloadLink).includes('.zip') ? '.zip' : '.srt';
    const fileName = `subfile${fileExt}`;
    const filePath = path.join(__dirname, fileName);

    const fileDownload = await axios.get(downloadLink, { responseType: 'arraybuffer' });
    fs.writeFileSync(filePath, fileDownload.data);

    await conn.sendMessage(m.chat, { document: fs.readFileSync(filePath), fileName: `${movieName}${fileExt}`, mimetype: 'application/octet-stream' }, { quoted: mek });
    
    fs.unlinkSync(filePath); // cleanup
  } catch (err) {
    console.log(err);
    reply("⚠️ Error occurred while fetching subtitle.");
  }
});
