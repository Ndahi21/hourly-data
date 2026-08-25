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
  const subjects = db.prepare('SELECT id, name, color FROM subjects ORDER BY id ASC').all();
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
    const result = db.prepare('INSERT INTO subjects (name, color) VALUES (?, ?)').run(cleanName, cleanColor);
    return res.status(201).json({ subject: { id: result.lastInsertRowid, name: cleanName, color: cleanColor } });
  } catch (error) {
    return res.status(409).json({ error: 'subject already exists' });
  }
});

app.put('/api/hour', (req, res) => {
  const { date, hour, subjectId } = req.body ?? {};

  if (!date || hour === undefined || !subjectId) {
    return res.status(400).json({ error: 'date, hour, and subjectId are required' });
  }

  const numericHour = Number(hour);
  const numericSubjectId = Number(subjectId);
  const cleanDate = String(date);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) || Number.isNaN(numericHour) || numericHour < 0 || numericHour > 23) {
    return res.status(400).json({ error: 'invalid date or hour' });
  }

  if (Number.isNaN(numericSubjectId)) {
    return res.status(400).json({ error: 'invalid subjectId' });
  }

  // Verify subject exists
  const subject = db.prepare('SELECT id FROM subjects WHERE id = ?').get(numericSubjectId);
  if (!subject) {
    return res.status(404).json({ error: 'subject not found' });
  }

  db.prepare(`
    INSERT INTO hour_entries (date, hour, subject_id)
    VALUES (?, ?, ?)
    ON CONFLICT(date, hour) DO UPDATE SET
      subject_id = excluded.subject_id
  `).run(cleanDate, numericHour, numericSubjectId);

  return res.json({ saved: true });
});

app.delete('/api/hour', (req, res) => {
  const { date, hour } = req.body ?? {};

  if (!date || hour === undefined) {
    return res.status(400).json({ error: 'date and hour are required' });
  }

  const numericHour = Number(hour);
  const cleanDate = String(date);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) || Number.isNaN(numericHour) || numericHour < 0 || numericHour > 23) {
    return res.status(400).json({ error: 'invalid date or hour' });
  }

  db.prepare('DELETE FROM hour_entries WHERE date = ? AND hour = ?').run(cleanDate, numericHour);

  return res.json({ deleted: true });
});

app.get('/api/week', (req, res) => {
  const { startDate } = req.query;

  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(startDate))) {
    return res.status(400).json({ error: 'startDate query param is required (YYYY-MM-DD)' });
  }

  const start = String(startDate);

  const entries = db.prepare(`
    SELECT 
      h.date,
      h.hour,
      s.name AS subjectName,
      s.color,
      s.id AS subjectId
    FROM hour_entries h
    JOIN subjects s ON h.subject_id = s.id
    WHERE h.date >= date(?)
      AND h.date < date(?, '+7 day')
    ORDER BY h.date ASC, h.hour ASC
  `).all(start, start);

  return res.json({ entries });
});

app.get('/api/day-rating', (req, res) => {
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: 'date query param is required (YYYY-MM-DD)' });
  }

  const review = db.prepare('SELECT rating FROM day_ratings WHERE date = ?').get(String(date));
  return res.json({ rating: review ? review.rating : null });
});

app.put('/api/day-rating', (req, res) => {
  const { date, rating } = req.body ?? {};

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'rating must be an integer from 1 to 5' });
  }

  db.prepare(`
    INSERT INTO day_ratings (date, rating)
    VALUES (?, ?)
    ON CONFLICT(date) DO UPDATE SET
      rating = excluded.rating,
      created_at = datetime('now')
  `).run(String(date), numericRating);

  return res.json({ saved: true, rating: numericRating });
});

// Analytics endpoint: Get hours per subject for the last N weeks
app.get('/api/analytics/weekly-trend', (req, res) => {
  const { weeks = 8 } = req.query;
  const numWeeks = Math.min(Math.max(parseInt(weeks), 1), 52); // Between 1-52 weeks

  // Calculate the start date (numWeeks * 7 days ago)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numWeeks * 7));
  const startDateStr = startDate.toISOString().split('T')[0];

  const data = db.prepare(`
    SELECT 
      DATE(h.date, '-' || ((CAST(strftime('%w', h.date) AS INTEGER) + 1) % 7) || ' days') as weekStart,
      s.name as subject,
      s.color,
      COUNT(*) as hours
    FROM hour_entries h
    JOIN subjects s ON h.subject_id = s.id
    WHERE h.date >= ?
      AND s.name != 'Sleep'
    GROUP BY weekStart, s.name, s.color
    ORDER BY weekStart ASC, s.name ASC
  `).all(startDateStr);

  return res.json({ data });
});

// Analytics endpoint: Get stacked bar chart data (hours per subject per week)
app.get('/api/analytics/weekly-breakdown', (req, res) => {
  const { weeks = 8 } = req.query;
  const numWeeks = Math.min(Math.max(parseInt(weeks), 1), 52);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numWeeks * 7));
  const startDateStr = startDate.toISOString().split('T')[0];

  const data = db.prepare(`
    SELECT 
      DATE(h.date, '-' || ((CAST(strftime('%w', h.date) AS INTEGER) + 1) % 7) || ' days') as weekStart,
      s.name as subject,
      s.color,
      COUNT(*) as hours
    FROM hour_entries h
    JOIN subjects s ON h.subject_id = s.id
    WHERE h.date >= ?
      AND s.name != 'Sleep'
    GROUP BY weekStart, s.name, s.color
    ORDER BY weekStart ASC, hours DESC
  `).all(startDateStr);

  return res.json({ data });
});

// Analytics endpoint: Get day ratings grouped by week
app.get('/api/analytics/weekly-rating', (req, res) => {
  const { weeks = 8 } = req.query;
  const numWeeks = Math.min(Math.max(parseInt(weeks), 1), 52);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (numWeeks * 7));
  const startDateStr = startDate.toISOString().split('T')[0];

  const data = db.prepare(`
    SELECT 
      DATE(date, '-' || ((CAST(strftime('%w', date) AS INTEGER) + 1) % 7) || ' days') as weekStart,
      CASE CAST(strftime('%w', date) AS INTEGER)
        WHEN 0 THEN 'Sun'
        WHEN 1 THEN 'Mon'
        WHEN 2 THEN 'Tue'
        WHEN 3 THEN 'Wed'
        WHEN 4 THEN 'Thu'
        WHEN 5 THEN 'Fri'
        WHEN 6 THEN 'Sat'
      END as day,
      rating
    FROM day_ratings
    WHERE date >= ?
    ORDER BY weekStart ASC, date ASC
  `).all(startDateStr);

  return res.json({ data });
});

// Get routine template
app.get('/api/routine', (_req, res) => {
  const entries = db.prepare(`
    SELECT 
      r.day_of_week as dayOfWeek,
      r.hour,
      s.name as subjectName,
      s.color,
      s.id as subjectId
    FROM routine_templates r
    JOIN subjects s ON r.subject_id = s.id
    ORDER BY r.day_of_week ASC, r.hour ASC
  `).all();

  return res.json({ entries });
});

// Save routine template
app.put('/api/routine', (req, res) => {
  const { entries } = req.body ?? {};

  if (!Array.isArray(entries)) {
    return res.status(400).json({ error: 'entries must be an array' });
  }

  try {
    db.transaction(() => {
      // Clear existing routine
      db.prepare('DELETE FROM routine_templates').run();

      // Insert new routine entries
      const insertStmt = db.prepare(`
        INSERT INTO routine_templates (day_of_week, hour, subject_id)
        VALUES (?, ?, ?)
      `);

      entries.forEach(entry => {
        const { dayOfWeek, hour, subjectId } = entry;

        if (
          typeof dayOfWeek !== 'number' ||
          typeof hour !== 'number' ||
          typeof subjectId !== 'number' ||
          dayOfWeek < 0 || dayOfWeek > 6 ||
          hour < 0 || hour > 23
        ) {
          throw new Error('Invalid entry format');
        }

        insertStmt.run(dayOfWeek, hour, subjectId);
      });
    })();

    return res.json({ saved: true });
  } catch (error) {
    console.error('Failed to save routine:', error);
    return res.status(500).json({ error: 'Failed to save routine' });
  }
});

app.listen(PORT, () => {
  console.log(`SQLite API running on http://localhost:${PORT}`);
});
