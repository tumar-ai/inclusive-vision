const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

const PROMPTS = {
  scan: {
    ru: 'Ты — ассистент для людей с нарушениями зрения. Опиши подробно что изображено на фото. Если есть текст — прочитай его. Отвечай на русском языке. Будь кратким, чётким и полезным.',
    kz: 'Сен — көру қабілеті нашар адамдарға арналған көмекшісің. Суретте не бейнеленгенін толық сипатта. Мәтін болса — оны оқы. Қазақ тілінде жауап бер. Қысқа, нақты және пайдалы бол.'
  },
  audit: {
    ru: `Ты — эксперт по доступной среде. Проверь фото на соответствие стандартам доступности:
1. Наличие пандусов (ramp_present)
2. Тактильная плитка (tactile_tiles)
3. Доступные знаки (accessible_signage)
4. Парковочные места для инвалидов (accessible_parking)
5. Ширина дверных проёмов (doorway_width)
6. Контрастная маркировка (contrast_marking)

Верни ответ СТРОГО в формате JSON без markdown:
{"score": <0-100>, "passed": ["id"], "failed": ["id"], "recommendations": ["текст"]}
Язык: русский.`,
    kz: `Сен — қолжетімді орта бойынша сарапшысың. Суретті қолжетімділік стандарттарына тексер:
1. Пандустар (ramp_present)
2. Тактильді плитка (tactile_tiles)
3. Қолжетімді белгілер (accessible_signage)
4. Мүгедектер тұрағы (accessible_parking)
5. Есік ені (doorway_width)
6. Контрастты белгілеу (contrast_marking)

Жауапты JSON форматында қайтар:
{"score": <0-100>, "passed": ["id"], "failed": ["id"], "recommendations": ["мәтін"]}
Тілі: қазақша.`
  },
  sign_language: {
    ru: 'Ты — эксперт по жестовому языку. Опиши какой жест показан на изображении и переведи его значение на русский язык.',
    kz: 'Сен — ым тілі бойынша сарапшысың. Суретте қандай ым көрсетілгенін сипатта және мағынасын қазақшаға аудар.'
  },
  navigate: {
    ru: 'Ты — навигационный помощник для людей с ограниченными возможностями. На основе описания или фото дай пошаговые инструкции по безопасному перемещению. Учитывай доступность маршрута.',
    kz: 'Сен — мүмкіндігі шектеулі адамдарға арналған навигация көмекшісісің. Сипаттама немесе сурет негізінде қауіпсіз жүру нұсқаулығын бер.'
  }
};

const MOCKS = {
  scan: {
    ru: 'На изображении виден городской тротуар с пешеходным переходом. Справа — здание с вывеской "Аптека". Тротуар ровный, без значительных препятствий. Ближайший светофор в 10 метрах впереди. Видна жёлтая тактильная плитка вдоль бордюра.',
    kz: 'Суретте жаяу жүргіншілер өтетін қалалық тротуар көрінеді. Оң жақта "Дәріхана" жазуы бар ғимарат. Тротуар тегіс, кедергілер жоқ. Жақын бағдаршам алда 10 метрде. Бордюр бойымен сары тактильді плитка көрінеді.'
  },
  audit: {
    ru: '{"score":65,"passed":["ramp_present","accessible_parking"],"failed":["tactile_tiles","accessible_signage","contrast_marking","doorway_width"],"recommendations":["Установить тактильную плитку от парковки до входа","Добавить таблички с шрифтом Брайля","Нанести контрастную маркировку на стеклянные двери","Расширить дверной проём до 900 мм"]}',
    kz: '{"score":65,"passed":["ramp_present","accessible_parking"],"failed":["tactile_tiles","accessible_signage","contrast_marking","doorway_width"],"recommendations":["Тұрақтан кіреберіске дейін тактильді плитка орнату","Брайль шрифтімен тақтайшалар қосу","Шыны есіктерге контрастты белгілеу жасау","Есік ойығын 900 мм-ге дейін кеңейту"]}'
  },
  sign_language: {
    ru: 'На изображении показан жест "Здравствуйте" на казахском жестовом языке. Рука поднята на уровень груди, ладонь открыта и направлена вперёд.',
    kz: 'Суретте қазақ ым тілінде "Сәлеметсіз бе" ымы көрсетілген. Қол кеуде деңгейіне көтерілген, алақан ашық.'
  },
  navigate: {
    ru: '**Маршрут:**\n\n1. Двигайтесь прямо 50 метров по тротуару\n2. На перекрёстке направо — есть звуковой светофор\n3. Пересеките улицу по переходу\n4. После перехода 30 метров прямо\n5. Вход справа — есть пандус\n\n⚠️ На участке 2-3 неровности тротуара.',
    kz: '**Маршрут:**\n\n1. Тротуармен 50 метр тура жүріңіз\n2. Қиылыста оңға — дыбыстық бағдаршам бар\n3. Өткел арқылы көшені кесіңіз\n4. Өткеннен кейін 30 метр тура\n5. Кіреберіс оң жақта — пандус бар\n\n⚠️ 2-3 учаскесінде тротуар тегіс емес.'
  }
};

export async function callClaude(type, imageBase64, lang = 'ru', additionalText = '') {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return MOCKS[type]?.[lang] || MOCKS[type]?.ru || 'Демо-режим';

  const prompt = PROMPTS[type]?.[lang] || PROMPTS[type]?.ru;
  const fullPrompt = additionalText ? `${prompt}\n\nКонтекст: ${additionalText}` : prompt;
  const content = [];

  if (imageBase64) {
    let mediaType = 'image/jpeg';
    if (imageBase64.startsWith('iVBOR')) mediaType = 'image/png';
    else if (imageBase64.startsWith('UklGR')) mediaType = 'image/webp';
    content.push({ type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } });
  }

  content.push({ type: 'text', text: fullPrompt });

  try {
    const resp = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 2000, messages: [{ role: 'user', content }] })
    });
    if (!resp.ok) throw new Error(`Claude API: ${resp.status}`);
    const data = await resp.json();
    return data.content[0].text;
  } catch (err) {
    console.error('Claude error:', err.message);
    return MOCKS[type]?.[lang] || 'Ошибка AI сервиса';
  }
}

export function parseAuditResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fall through */ }
    }
    return { score: 0, passed: [], failed: [], recommendations: ['Не удалось проанализировать изображение'] };
  }
}
