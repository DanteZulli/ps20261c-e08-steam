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

app.post('/api/login', (req, res) => {
  const db = getDb();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  const usuario = db
    .prepare(
      `
        SELECT username, email
        FROM usuarios
        WHERE email = ? AND password = ?
      `
    )
    .get(email, password);

  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  return res.json({
    user_name: usuario.username,
    email: usuario.email,
  });
});

app.get('/api/hello', (_req, res) => {
  const db = getDb();
  const juegos = db.prepare('SELECT COUNT(*) as total FROM juegos').get();
  res.json({ message: '¡Hola desde el backend! 🎮', juegos: juegos.total });
});

app.get('/api/juegos', (req, res) => {
  const db = getDb();

  const busqueda = req.query.q || '';
  const genero = req.query.genero || '';

  let query = `
    SELECT * FROM juegos
    WHERE titulo LIKE ?
  `;

  const params = [`%${busqueda}%`];

  if (genero) {
    query += ` AND genero = ?`;
    params.push(genero);
  }

  const juegos = db.prepare(query).all(...params);

  res.json(juegos);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

