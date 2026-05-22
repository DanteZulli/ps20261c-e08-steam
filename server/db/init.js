const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'steam-lite.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS juegos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      imagen_url TEXT,
      genero TEXT,
      fecha_lanzamiento TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS biblioteca (
      usuario_id INTEGER NOT NULL,
      juego_id INTEGER NOT NULL,
      fecha_adquisicion TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (usuario_id, juego_id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
      FOREIGN KEY (juego_id) REFERENCES juegos(id)
    );

    CREATE TABLE IF NOT EXISTS resenas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contenido TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      juego_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (juego_id) REFERENCES juegos(id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS ofertas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      descuento INTEGER NOT NULL CHECK(descuento >= 0 AND descuento <= 100),
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT NOT NULL,
      juego_id INTEGER NOT NULL,
      activa INTEGER DEFAULT 1,
      FOREIGN KEY (juego_id) REFERENCES juegos(id)
    );
  `);

  return db;
}

function resetDb() {
  if (db) db.close();
  const fs = require('fs');
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('Base de datos eliminada.');
  }
  db = null;
}

module.exports = { getDb, initDb, resetDb };
