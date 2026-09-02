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
    slot INTEGER NOT NULL CHECK (slot >= 0 AND slot <= 47),
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(date, slot)
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

const migrateHourlyTable = (tableName, createTable, copyEntries) => {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();

  if (columns.length === 0) {
    db.exec(createTable);
    return;
  }

  if (columns.some((column) => column.name === 'slot')) {
    return;
  }

  db.transaction(() => {
    db.exec(`ALTER TABLE ${tableName} RENAME TO ${tableName}_hourly_backup`);
    db.exec(createTable);
    db.exec(copyEntries);
    db.exec(`DROP TABLE ${tableName}_hourly_backup`);
  })();
};

migrateHourlyTable(
  'hour_entries',
  createHourEntriesTable,
  `
    INSERT INTO hour_entries (id, date, slot, subject_id, created_at)
    SELECT id, date, hour * 2, subject_id, created_at
    FROM hour_entries_hourly_backup
  `
);

db.exec(`
  CREATE TABLE IF NOT EXISTS day_ratings (
    date TEXT NOT NULL UNIQUE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

migrateHourlyTable(
  'routine_templates',
  createRoutineTemplatesTable,
  `
    INSERT INTO routine_templates (id, day_of_week, slot, subject_id, created_at)
    SELECT id, day_of_week, hour * 2, subject_id, created_at
    FROM routine_templates_hourly_backup
  `
);

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
