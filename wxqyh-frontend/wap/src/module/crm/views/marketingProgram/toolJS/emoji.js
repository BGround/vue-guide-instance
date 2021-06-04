// 获取emoji数据
export function emoji() {
  const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 😬 😷 😈 👿 👹 👺 👧 🐉 💩 👻 💀 ☠️ 🐎 👽 👾 🎃 🎅 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 🙍 👤 👶 👍 👎 👊 ✊ 👌 👈 👉 👆 👇 ✋ 🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 '
    .split(' ')
    .filter(v => v)
    .map(v => ({
      value: v
    }))
  let result = []
  let step = 24
  for (let i = 0, length = emoji.length; i < length; i += step) {
    result.push(emoji.slice(i, i + step))
  }
  return result
}