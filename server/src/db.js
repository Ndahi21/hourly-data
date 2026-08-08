import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'timetable.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Drop old hour_entries table if it exists (schema migration)
db.exec('DROP TABLE IF EXISTS hour_entries');

db.exec(`
  CREATE TABLE hour_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(date, hour)
  );
`);

const defaultSubjects = [
  { name: 'Sleep', color: '#535353' },
  { name: 'Social', color: '#aef6ff' },
  { name: 'Work', color: '#926828' },
  { name: 'Art', color: '#ff0000' },
  { name: 'Maintenance', color: '#07037c' },
  { name: 'Computer Science', color: '#2a05ff' },
  { name: 'Exercise', color: '#12d401' },
];

const seedStmt = db.prepare('INSERT OR IGNORE INTO subjects (name, color) VALUES (?, ?)');
const seedSubjects = db.transaction((subjects) => {
  subjects.forEach((subject) => seedStmt.run(subject.name, subject.color));
});
seedSubjects(defaultSubjects);

export default db;
