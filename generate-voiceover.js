const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

// ── Вставь свой API ключ сюда ──────────────────────────────────────────────
const API_KEY = 'ВСТАВЬ_КЛЮЧ_СЮДА';

const api = new axios.create({
  baseURL: 'https://api.ai.cc/v1',
  headers: { Authorization: `Bearer ${API_KEY}` },
});

// ── Текст для озвучки (каждая фраза = отдельный файл) ─────────────────────
const SCENES = [
  { id: 'intro',     text: 'TrustDepo.' },
  { id: 'hook',      text: 'Still sending money to strangers directly?' },
  { id: 'meet',      text: 'Meet TrustDepo — escrow for everyone.' },
  { id: 'safe',      text: "Buyer's funds held safe." },
  { id: 'norisk',    text: 'No risk on either side.' },
  { id: 'covered',   text: 'Every deal covered. Every amount. Protected.' },
];

// ── Голос — британский мужской ─────────────────────────────────────────────
const VOICE_ID = 'Wise_Woman'; // замени если хочешь другой

const outDir = path.resolve(__dirname, 'public/sounds/vo');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const main = async () => {
  console.log('🎙  Генерирую войсовер...\n');

  for (const scene of SCENES) {
    const outPath = path.join(outDir, `${scene.id}.wav`);
    console.log(`  → ${scene.id}: "${scene.text}"`);

    try {
      const response = await api.post(
        '/tts',
        {
          model: 'minimax/speech-2.8-hd',
          text: scene.text,
          voice_setting: { voice_id: VOICE_ID },
        },
        { responseType: 'stream' },
      );

      await new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(outPath);
        response.data.pipe(writeStream);
        writeStream.on('close', resolve);
        writeStream.on('error', reject);
      });

      console.log(`    ✓ Сохранено: ${outPath}`);
    } catch (err) {
      console.error(`    ✗ Ошибка для "${scene.id}":`, err.message);
    }
  }

  console.log('\n✅ Готово! Файлы в public/sounds/vo/');
  console.log('   Теперь подключи их в Composition.tsx через staticFile()');
};

main();
