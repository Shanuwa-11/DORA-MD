const fetch = require('node-fetch');

const handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🎬 *Please enter a movie name!*\n\n_Example: .movie Interstellar_');

  const api = `https://www.omdbapi.com/?apikey=6e0f4ff3&t=${encodeURIComponent(text)}`; // Free OMDb API key
  try {
    const res = await fetch(api);
    const data = await res.json();

    if (data.Response === 'False') return m.reply('❌ Movie not found!');

    const caption = `
🎬 *${data.Title}* (${data.Year})
⭐ *Rating:* ${data.imdbRating}
🎭 *Genre:* ${data.Genre}
🕒 *Runtime:* ${data.Runtime}
📖 *Plot:* ${data.Plot}
🎞 *Director:* ${data.Director}
🎟 *Actors:* ${data.Actors}
🌐 *Language:* ${data.Language}
    `.trim();

    await conn.sendFile(m.chat, data.Poster, 'poster.jpg', caption, m);
  } catch (e) {
    console.error(e);
    m.reply('❌ Error retrieving movie info.');
  }
};

handler.help = ['movie <name>'];
handler.tags = ['entertainment'];
handler.command = ['movie'];

module.exports = handler;
