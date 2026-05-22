const express = require('express');
const cors = require('cors');
const { initDb, getDb, resetDb } = require('./db/init');
const { seed } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.RESET_DB) {
  resetDb();
}
initDb();
seed();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (_req, res) => {
  const db = getDb();
  const juegos = db.prepare('SELECT COUNT(*) as total FROM juegos').get();
  res.json({ message: '¡Hola desde el backend! 🎮', juegos: juegos.total });
});

app.get('/api/juegos', (_req, res) => {
  const db = getDb();

  const juegos = db.prepare(`
    SELECT * FROM juegos
  `).all();

  res.json(juegos);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

