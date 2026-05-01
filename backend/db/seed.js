import { initDB, getDB } from './database.js';
import { v4 as uuidv4 } from 'uuid';

initDB();
const db = getDB();

const seedAudits = [
  {
    id: uuidv4(),
    location_name: 'Школа №45 им. Абая',
    location_type: 'school',
    score: 45,
    passed: JSON.stringify(['accessible_parking']),
    failed: JSON.stringify(['ramp_present', 'tactile_tiles', 'accessible_signage', 'doorway_width', 'contrast_marking']),
    recommendations: JSON.stringify([
      'Установить пандус с поручнями у главного входа (уклон не более 1:12)',
      'Уложить тактильную плитку от тротуара до входа',
      'Добавить информационные таблички шрифтом Брайля',
      'Расширить дверные проёмы до минимум 900 мм',
      'Нанести контрастную маркировку на ступени'
    ]),
    lang: 'ru',
    created_at: '2026-04-15T10:30:00Z'
  },
  {
    id: uuidv4(),
    location_name: 'Станция метро «Байконыр»',
    location_type: 'metro',
    score: 73,
    passed: JSON.stringify(['ramp_present', 'tactile_tiles', 'accessible_signage']),
    failed: JSON.stringify(['accessible_parking', 'doorway_width', 'contrast_marking']),
    recommendations: JSON.stringify([
      'Оборудовать парковочные места для инвалидов рядом со входом',
      'Расширить турникетные проходы для колясок',
      'Добавить контрастную маркировку на платформе'
    ]),
    lang: 'ru',
    created_at: '2026-04-20T14:15:00Z'
  },
  {
    id: uuidv4(),
    location_name: 'Бизнес-центр «Нурлы Тау»',
    location_type: 'business',
    score: 91,
    passed: JSON.stringify(['ramp_present', 'tactile_tiles', 'accessible_signage', 'accessible_parking', 'doorway_width']),
    failed: JSON.stringify(['contrast_marking']),
    recommendations: JSON.stringify([
      'Улучшить контрастную маркировку на стеклянных дверях'
    ]),
    lang: 'ru',
    created_at: '2026-04-28T09:45:00Z'
  }
];

db.exec('DELETE FROM audits');

const stmt = db.prepare(`
  INSERT INTO audits (id, location_name, location_type, score, passed, failed, recommendations, lang, created_at)
  VALUES (@id, @location_name, @location_type, @score, @passed, @failed, @recommendations, @lang, @created_at)
`);

for (const audit of seedAudits) {
  stmt.run(audit);
}

console.log(`✅ Seeded ${seedAudits.length} sample audits`);
process.exit(0);
