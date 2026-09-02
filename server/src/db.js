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

const createHourEntriesTable = `
  CREATE TABLE IF NOT EXISTS hour_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(date, hour)
  );
`;

const createRoutineTemplatesTable = `
  CREATE TABLE IF NOT EXISTS routine_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    slot INTEGER NOT NULL CHECK (slot >= 0 AND slot <= 47),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(day_of_week, slot)
  );
`;

const hourEntryColumns = db.prepare('PRAGMA table_info(hour_entries)').all();

if (hourEntryColumns.length === 0) {
  db.exec(createHourEntriesTable);
} else if (hourEntryColumns.some((column) => column.name === 'slot')) {
  db.transaction(() => {
    db.exec('ALTER TABLE hour_entries RENAME TO hour_entries_half_hour_backup');
    db.exec(createHourEntriesTable);
    // Prior hourly data lives in even slots; use a :30 slot only when the hour is otherwise empty.
    db.exec(`
      INSERT OR IGNORE INTO hour_entries (date, hour, subject_id, created_at)
      SELECT date, slot / 2, subject_id, created_at
      FROM hour_entries_half_hour_backup
      ORDER BY slot % 2 ASC, id ASC
    `);
    db.exec('DROP TABLE hour_entries_half_hour_backup');
  })();
}

db.exec(`
  CREATE TABLE IF NOT EXISTS day_ratings (
    date TEXT NOT NULL UNIQUE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const routineTemplateColumns = db.prepare('PRAGMA table_info(routine_templates)').all();

if (routineTemplateColumns.length === 0) {
  db.exec(createRoutineTemplatesTable);
} else if (routineTemplateColumns.some((column) => column.name === 'hour')) {
  db.transaction(() => {
    db.exec('ALTER TABLE routine_templates RENAME TO routine_templates_hourly_backup');
    db.exec(createRoutineTemplatesTable);
    db.exec(`
      INSERT INTO routine_templates (id, day_of_week, slot, subject_id, created_at)
      SELECT id, day_of_week, hour * 2, subject_id, created_at
      FROM routine_templates_hourly_backup
    `);
    db.exec('DROP TABLE routine_templates_hourly_backup');
  })();
}

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

// Migration: Delete "Erase" from database (it's frontend-only)
db.prepare('DELETE FROM subjects WHERE name = ?').run('Erase');

export default db;
