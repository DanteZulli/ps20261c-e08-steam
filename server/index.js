const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { initDb, getDb, resetDb } = require('./db/init');
const { seed } = require('./db/seed');

const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

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
      `SELECT id, username, email FROM usuarios WHERE email = ? AND password = ?`
    )
    .get(email, hash(password));

  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  return res.json({
    user_id: usuario.id,
    user_name: usuario.username,
    email: usuario.email,
  });
});

app.post('/api/register', (req, res) => {
  const db = getDb();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) {
    return res.status(409).json({ message: 'El email ya está registrado.' });
  }

  db.prepare(
    'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)'
  ).run(username, email, hash(password));

  return res.status(201).json({ message: 'Usuario registrado correctamente.' });
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
    SELECT j.*,
      o.id as oferta_id,
      o.descuento,
      o.fecha_inicio as oferta_inicio,
      o.fecha_fin as oferta_fin,
      ROUND(j.precio * (100.0 - o.descuento) / 100.0, 2) as precio_oferta
    FROM juegos j
    LEFT JOIN ofertas o ON j.id = o.juego_id AND o.activa = 1
      AND date('now') >= o.fecha_inicio
      AND date('now') <= o.fecha_fin
    WHERE j.titulo LIKE ?
  `;

  const params = [`%${busqueda}%`];

  if (genero) {
    query += ` AND j.genero = ?`;
    params.push(genero);
  }

  query += ` ORDER BY j.titulo ASC`;

  const juegos = db.prepare(query).all(...params);

  res.json(juegos);
});

app.post('/api/biblioteca', (req, res) => {
  const db = getDb()
  const { usuario_id, juegos_ids } = req.body

  if (!usuario_id || !juegos_ids || juegos_ids.length === 0) {
    return res.status(400).json({ message: 'Faltan datos para procesar la compra.' })
  }

  const insertar = db.prepare(`
    INSERT OR IGNORE INTO biblioteca (usuario_id, juego_id)
    VALUES (?, ?)
  `)

  const transaction = db.transaction(() => {
    for (const juego_id of juegos_ids) {
      insertar.run(usuario_id, juego_id)
    }
  })

  transaction()

  res.status(201).json({ message: 'Compra realizada con éxito.' })
})

app.get('/api/juegos/:id', (req,res)  =>{
  const db=getDb();
  const id= req.params.id;

    const juego = db.prepare(`
      SELECT j.*,
        o.id as oferta_id,
        o.descuento,
        o.fecha_inicio as oferta_inicio,
        o.fecha_fin as oferta_fin,
        ROUND(j.precio * (100.0 - o.descuento) / 100.0, 2) as precio_oferta
      FROM juegos j
      LEFT JOIN ofertas o ON j.id = o.juego_id AND o.activa = 1
        AND date('now') >= o.fecha_inicio
        AND date('now') <= o.fecha_fin
      WHERE j.id = ?
    `).get(id) 

     if (!juego) {
    return res.status(404).json({ message: 'No se encontro un juego con los parametros recibidos' });
  }
    res.json(juego);
});

// 1. Obtener todas las reseñas de un juego específico
app.get('/api/juegos/:id/resenas', (req, res) => {
  const db = getDb();
  const juegoId = req.params.id;

  try {
    const resenas = db.prepare(`
      SELECT r.*, u.username 
      FROM resenas r
      JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.juego_id = ?
      ORDER BY r.created_at DESC
    `).all(juegoId);

    res.json(resenas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reseñas.' });
  }
});

app.post('/api/resenas', (req, res) => {
  const db = getDb();
  const { contenido, rating, juego_id, usuario_id } = req.body;

  if (!contenido || !rating || !juego_id || !usuario_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'El rating debe ser entre 1 y 5.' });
  }

  try {
    const info = db.prepare(`
      INSERT INTO resenas (contenido, rating, juego_id, usuario_id)
      VALUES (?, ?, ?, ?)
    `).run(contenido, rating, juego_id, usuario_id);

    res.status(201).json({ 
      message: 'Reseña guardada con éxito.', 
      resenaId: info.lastInsertRowid 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al guardar la reseña.' });
  }
});

// RUTA TEMPORAL PARA LIMPIAR RESEÑAS DE PRUEBA
app.get('/api/limpiar-resenas-test', (req, res) => {
  const db = getDb();
  try {
    // Borramos solo las reseñas que tengan el contenido que estuviste probando
    // o podés usar 'DELETE FROM resenas WHERE id > 2' para borrar las nuevas
    const info = db.prepare("DELETE FROM resenas WHERE contenido = 'Unlujaso' OR id > 2").run();
    res.send(`<h1>¡Se eliminaron ${info.changes} reseñas de prueba con éxito!</h1>`);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

app.get('/api/biblioteca/:id', (req,res) =>{
  const db= getDb();
  const id= req.params.id;
  const biblioteca= db.prepare(`SELECT j.id, j.titulo, j.descripcion, j.precio, b.fecha_adquisicion
  FROM biblioteca b
  INNER JOIN juegos j
  ON b.juego_id = j.id
  WHERE b.usuario_id = ?;`).all(id);

  if(!biblioteca){
    res.status(401).json({message:"No se encontro una biblioteca de este usuario"})
  }

  res.json(biblioteca);
})


// ─── Ofertas API ─────────────────────────────────────────────

function checkExpiredOffers() {
  const db = getDb();
  const { changes } = db.prepare(`
    UPDATE ofertas SET activa = 0
    WHERE activa = 1 AND date('now') > fecha_fin
  `).run();
  if (changes > 0) {
    console.log(`[Ofertas] ${changes} oferta(s) expirada(s) desactivada(s).`);
  }
}

// Ejecutar cada minuto
setInterval(checkExpiredOffers, 60_000);
// También al iniciar
checkExpiredOffers();

// Listar todas las ofertas con info del juego
app.get('/api/ofertas', (req, res) => {
  const db = getDb();
  const ofertas = db.prepare(`
    SELECT o.*, j.titulo as juego_titulo, j.precio as juego_precio,
      ROUND(j.precio * (100.0 - o.descuento) / 100.0, 2) as precio_oferta
    FROM ofertas o
    JOIN juegos j ON j.id = o.juego_id
    ORDER BY o.activa DESC, o.fecha_fin ASC
  `).all();
  res.json(ofertas);
});

// Crear una oferta
app.post('/api/ofertas', (req, res) => {
  const db = getDb();
  const { juego_id, descuento, fecha_inicio, fecha_fin } = req.body;

  if (!juego_id || descuento == null || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  const d = Number(descuento);
  if (d < 0 || d > 100) {
    return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100.' });
  }

  if (fecha_fin < fecha_inicio) {
    return res.status(400).json({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio.' });
  }

  const juego = db.prepare('SELECT id FROM juegos WHERE id = ?').get(juego_id);
  if (!juego) {
    return res.status(404).json({ message: 'El juego no existe.' });
  }

  const info = db.prepare(`
    INSERT INTO ofertas (descuento, fecha_inicio, fecha_fin, juego_id, activa)
    VALUES (?, ?, ?, ?, 1)
  `).run(d, fecha_inicio, fecha_fin, juego_id);

  res.status(201).json({
    message: 'Oferta creada correctamente.',
    ofertaId: info.lastInsertRowid,
  });
});

// Eliminar una oferta
app.delete('/api/ofertas/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  const oferta = db.prepare('SELECT id FROM ofertas WHERE id = ?').get(id);
  if (!oferta) {
    return res.status(404).json({ message: 'Oferta no encontrada.' });
  }

  db.prepare('DELETE FROM ofertas WHERE id = ?').run(id);
  res.json({ message: 'Oferta eliminada.' });
});

// Crear ofertas masivas por etiqueta (género)
app.post('/api/ofertas/bulk', (req, res) => {
  const db = getDb();
  const { genero, descuento, fecha_inicio, fecha_fin } = req.body;

  if (!genero || descuento == null || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  const d = Number(descuento);
  if (d < 0 || d > 100) {
    return res.status(400).json({ message: 'El descuento debe estar entre 0 y 100.' });
  }

  if (fecha_fin < fecha_inicio) {
    return res.status(400).json({ message: 'La fecha de fin no puede ser anterior a la fecha de inicio.' });
  }

  const juegos = db.prepare('SELECT id FROM juegos WHERE genero = ?').all(genero);
  if (juegos.length === 0) {
    return res.status(404).json({ message: `No se encontraron juegos con el género "${genero}".` });
  }

  const insertar = db.prepare(`
    INSERT OR IGNORE INTO ofertas (descuento, fecha_inicio, fecha_fin, juego_id, activa)
    VALUES (?, ?, ?, ?, 1)
  `);

  const transaction = db.transaction(() => {
    for (const juego of juegos) {
      insertar.run(d, fecha_inicio, fecha_fin, juego.id);
    }
  });

  transaction();

  res.status(201).json({
    message: `Ofertas creadas para ${juegos.length} juego(s) del género "${genero}".`,
    cantidad: juegos.length,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

