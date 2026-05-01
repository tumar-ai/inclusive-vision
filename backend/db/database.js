import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'inclusive_vision.db');

let db;

export function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDB() {
  const db = getDB();
  db.exec(`
    CREATE TABLE IF NOT EXISTS audits (
      id TEXT PRIMARY KEY,
      location_name TEXT NOT NULL,
      location_type TEXT,
      image_data TEXT,
      score INTEGER,
      passed TEXT,
      failed TEXT,
      recommendations TEXT,
      lang TEXT DEFAULT 'ru',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      image_data TEXT,
      description TEXT,
      extracted_text TEXT,
      lang TEXT DEFAULT 'ru',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Database initialized');
  return db;
}
