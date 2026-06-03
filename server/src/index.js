import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/subjects', (_req, res) => {
  const subjects = db.prepare('SELECT name, color FROM subjects ORDER BY id ASC').all();
  res.json({ subjects });
});

app.post('/api/subjects', (req, res) => {
  const { name, color } = req.body ?? {};

  if (!name || !color) {
    return res.status(400).json({ error: 'name and color are required' });
  }

  const cleanName = String(name).trim();
  const cleanColor = String(color).trim();

  if (!cleanName || !/^#[0-9a-fA-F]{6}$/.test(cleanColor)) {
    return res.status(400).json({ error: 'invalid name or color format' });
  }

  try {
    db.prepare('INSERT INTO subjects (name, color) VALUES (?, ?)').run(cleanName, cleanColor);
    return res.status(201).json({ subject: { name: cleanName, color: cleanColor } });
  } catch (error) {
    return res.status(409).json({ error: 'subject already exists' });
  }
});

app.put('/api/hour', (req, res) => {
  const { date, hour, subjectName, color } = req.body ?? {};

  if (!date || hour === undefined || !subjectName || !color) {
    return res.status(400).json({ error: 'date, hour, subjectName, and color are required' });
  }

  const numericHour = Number(hour);
  const cleanDate = String(date);
  const cleanSubjectName = String(subjectName).trim();
  const cleanColor = String(color).trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) || Number.isNaN(numericHour) || numericHour < 0 || numericHour > 23) {
    return res.status(400).json({ error: 'invalid date or hour' });
  }

  if (!cleanSubjectName || !/^#[0-9a-fA-F]{6}$/.test(cleanColor)) {
    return res.status(400).json({ error: 'invalid subjectName or color format' });
  }

  db.prepare(`
    INSERT INTO hour_entries (date, hour, subject_name, color, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(date, hour) DO UPDATE SET
      subject_name = excluded.subject_name,
      color = excluded.color,
      updated_at = datetime('now')
  `).run(cleanDate, numericHour, cleanSubjectName, cleanColor);

  return res.json({ saved: true });
});

app.get('/api/week', (req, res) => {
  const { startDate } = req.query;

  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(startDate))) {
    return res.status(400).json({ error: 'startDate query param is required (YYYY-MM-DD)' });
  }

  const start = String(startDate);

  const entries = db.prepare(`
    SELECT date, hour, subject_name AS subjectName, color
    FROM hour_entries
    WHERE date >= date(?)
      AND date < date(?, '+7 day')
    ORDER BY date ASC, hour ASC
  `).all(start, start);

  return res.json({ entries });
});

app.listen(PORT, () => {
  console.log(`SQLite API running on http://localhost:${PORT}`);
});
