const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
  {
    pattern: "video",
    react: "📽️",
    desc: "Download YouTube Video",
    category: "download",
    filename: __filename,
  },
  async (
    robin,
    mek,
    m,
    { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }
  ) => {
    try {
      if (!q) return reply("*Provide a name or a YouTube link.* 🎥");

      // Search for the video
      const search = await yts(q);
      const data = search.videos[0];
      const url = data.url;

      // Video metadata description
      let desc = `🎬⊷─ DORA 𝘔𝘋 𝘝𝘐𝘋𝘌𝘖 𝘋𝘖𝘞𝘕𝘓𝘖𝘈𝘚𝘌𝘙 ─⊷🎬


╭────────────────────────╮
│ 
│    ⚕ 𝚃𝙸𝚃𝙻𝙴 :  ${data.title}                 
│                                                                       
│    ⚕ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽 :  ${data.timestamp}                 
│                                                                                               
│    ⚕ 𝚅𝙸𝙴𝚆𝚂 :  ${data.views}                         
│                                                                            
│    ⚕ 𝚄𝙿𝙻𝙾𝙰𝙳𝙴𝙱 : ${data.ago}
│
│    ⚕ 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 : ${data.author.name}
│
│    ⚕ 𝙻𝙸𝙽𝙺 :  ${data.url}
│        
╰────────────────────────╯

𝙵𝙾𝙻𝙻𝙾𝚆 𝙲𝙷𝙰𝙽𝙽𝙴𝙻 :- https://whatsapp.com/channel/0029Vag1WQFJf05dF0pQeU3u

╭╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼◉៚
│  > © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴏʀᴀ ᴍᴅ
╰╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼◉៚`;

      // Send metadata and thumbnail message
      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // Video download function
      const downloadVideo = async (url, quality) => {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(
          url
        )}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.success) {
          const { id, title } = response.data;

          // Wait for download URL generation
          const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
          while (true) {
            const progress = await axios.get(progressUrl);
            if (progress.data.success && progress.data.progress === 1000) {
              const videoBuffer = await axios.get(progress.data.download_url, {
                responseType: "arraybuffer",
              });
              return { buffer: videoBuffer.data, title };
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        } else {
          throw new Error("Failed to fetch video details.");
        }
      };

      // Specify desired quality (default: 720p)
      const quality = "720";

      // Download and send video
      const video = await downloadVideo(url, quality);
      await robin.sendMessage(
        from,
        {
          video: video.buffer,
          caption: `🎥 *${video.title}*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ ʀᴀᴠɪ ᴍᴅ`,
        },
        { quoted: mek }
      );

      reply("*Thanks for using my bot!* ❤️");
    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);
