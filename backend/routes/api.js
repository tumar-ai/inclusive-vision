import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../db/database.js';
import { callClaude, parseAuditResponse } from '../services/claude.js';
import PDFDocument from 'pdfkit';

const router = Router();

// POST /api/v1/scan — analyze image
router.post('/scan', async (req, res) => {
  try {
    const { image_base64, lang = 'ru', text } = req.body;
    if (!image_base64) return res.status(400).json({ error: 'image_base64 is required' });

    const description = await callClaude('scan', image_base64, lang, text);
    const id = uuidv4();
    const db = getDB();

    db.prepare('INSERT INTO scans (id, image_data, description, lang) VALUES (?, ?, ?, ?)')
      .run(id, image_base64.substring(0, 100), description, lang);

    res.json({ id, description, lang, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Scan failed' });
  }
});

// POST /api/v1/audit — compliance check
router.post('/audit', async (req, res) => {
  try {
    const { image_base64, location_name = 'Без названия', location_type = 'other', lang = 'ru' } = req.body;
    if (!image_base64) return res.status(400).json({ error: 'image_base64 is required' });

    const rawResponse = await callClaude('audit', image_base64, lang);
    const auditResult = parseAuditResponse(rawResponse);
    const id = uuidv4();
    const db = getDB();

    db.prepare(`INSERT INTO audits (id, location_name, location_type, image_data, score, passed, failed, recommendations, lang)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, location_name, location_type, image_base64.substring(0, 100),
        auditResult.score, JSON.stringify(auditResult.passed), JSON.stringify(auditResult.failed),
        JSON.stringify(auditResult.recommendations), lang);

    res.json({ id, location_name, ...auditResult, lang, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Audit error:', err);
    res.status(500).json({ error: 'Audit failed' });
  }
});

// POST /api/v1/translate — sign language
router.post('/translate', async (req, res) => {
  try {
    const { image_base64, lang = 'ru' } = req.body;
    if (!image_base64) return res.status(400).json({ error: 'image_base64 is required' });
    const translation = await callClaude('sign_language', image_base64, lang);
    res.json({ translation, lang, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// POST /api/v1/navigate — navigation assistance
router.post('/navigate', async (req, res) => {
  try {
    const { image_base64, description, lang = 'ru' } = req.body;
    const guidance = await callClaude('navigate', image_base64 || null, lang, description);
    res.json({ guidance, lang, created_at: new Date().toISOString() });
  } catch (err) {
    console.error('Navigate error:', err);
    res.status(500).json({ error: 'Navigation failed' });
  }
});

// GET /api/v1/audits — list past audits
router.get('/audits', (_req, res) => {
  const db = getDB();
  const audits = db.prepare('SELECT id, location_name, location_type, score, lang, created_at FROM audits ORDER BY created_at DESC').all();
  res.json(audits);
});

// GET /api/v1/audits/:id — single audit detail
router.get('/audits/:id', (req, res) => {
  const db = getDB();
  const audit = db.prepare('SELECT * FROM audits WHERE id = ?').get(req.params.id);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });
  audit.passed = JSON.parse(audit.passed || '[]');
  audit.failed = JSON.parse(audit.failed || '[]');
  audit.recommendations = JSON.parse(audit.recommendations || '[]');
  res.json(audit);
});

// GET /api/v1/audits/:id/pdf — PDF export
router.get('/audits/:id/pdf', (req, res) => {
  const db = getDB();
  const audit = db.prepare('SELECT * FROM audits WHERE id = ?').get(req.params.id);
  if (!audit) return res.status(404).json({ error: 'Audit not found' });

  const passed = JSON.parse(audit.passed || '[]');
  const failed = JSON.parse(audit.failed || '[]');
  const recs = JSON.parse(audit.recommendations || '[]');

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=audit-${audit.id.slice(0, 8)}.pdf`);
  doc.pipe(res);

  doc.fontSize(22).text('Inclusive Vision — Отчёт аудита', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Объект: ${audit.location_name}`);
  doc.text(`Тип: ${audit.location_type}`);
  doc.text(`Дата: ${audit.created_at}`);
  doc.text(`Оценка: ${audit.score}/100`);
  doc.moveDown();

  doc.fontSize(16).text('Пройдено:', { underline: true });
  passed.forEach(p => doc.fontSize(12).text(`  ✅ ${p}`));
  doc.moveDown();

  doc.fontSize(16).text('Не пройдено:', { underline: true });
  failed.forEach(f => doc.fontSize(12).text(`  ❌ ${f}`));
  doc.moveDown();

  doc.fontSize(16).text('Рекомендации:', { underline: true });
  recs.forEach((r, i) => doc.fontSize(12).text(`  ${i + 1}. ${r}`));

  doc.end();
});

export default router;
