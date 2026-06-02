const { getDb } = require('./init');
const crypto = require('crypto');

const hash = (s) => crypto.createHash('sha256').update(s).digest('hex');

function seed() {
  const db = getDb();

  const userCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get().count;
  if (userCount > 0) {
    console.log('Seed ya ejecutado, saltando...');
    return;
  }

  const insertUsuario = db.prepare(
    'INSERT INTO usuarios (username, email, password, avatar_url) VALUES (?, ?, ?, ?)'
  );
  const insertJuego = db.prepare(
    'INSERT INTO juegos (titulo, descripcion, precio, imagen_url, genero, fecha_lanzamiento) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertBiblioteca = db.prepare(
    'INSERT INTO biblioteca (usuario_id, juego_id) VALUES (?, ?)'
  );
  const insertResena = db.prepare(
    'INSERT INTO resenas (contenido, rating, juego_id, usuario_id) VALUES (?, ?, ?, ?)'
  );
  const insertOferta = db.prepare(
    'INSERT INTO ofertas (descuento, fecha_inicio, fecha_fin, juego_id, activa) VALUES (?, ?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    insertUsuario.run('dante', 'dante@test.com', hash('123456'), '/images/avatarhombre.png');
    insertUsuario.run('alice', 'alice@test.com', hash('123456'), '/images/avatarmujer.png');
    insertUsuario.run('bob', 'bob@test.com', hash('123456'), '/images/avatarhombre.png');

    const juegos = [
      ['Dark Souls III', 'RPG de acción en un mundo oscuro', 59.99, '/images/darksoul3.jpg', 'RPG', '2016-03-24'],
      ['Hollow Knight', 'Metroidvania de insectos en un reino caído', 14.99, '/images/hollowknight.webp', 'Metroidvania', '2017-02-24'],
      ['Stardew Valley', 'Granja, amistades y aventuras', 9.99, '/images/stardewwalley.jpg', 'Simulación', '2016-02-26'],
      ['Celeste', 'Plataformero sobre una montaña y uno mismo', 19.99, '/images/celeste.webp', 'Plataformas', '2018-01-25'],
      ['Portal 2', 'Puzzles cooperativos con portales', 9.99, '/images/portal2.webp', 'Puzzle', '2011-04-18'],
      ['Elden Ring', 'Mundo abierto de fantasía oscura', 59.99, '/images/eldenring.webp', 'RPG', '2022-02-25'],
      ['Hades', 'Roguelike mitológico', 24.99, '/images/hades.webp', 'Roguelike', '2020-09-17'],
    ];

    for (const j of juegos) {
      insertJuego.run(...j);
    }

    insertBiblioteca.run(1, 1);
    insertBiblioteca.run(1, 2);
    insertBiblioteca.run(1, 5);
    insertBiblioteca.run(2, 3);
    insertBiblioteca.run(2, 4);
    insertBiblioteca.run(3, 6);
    insertBiblioteca.run(3, 7);
    insertBiblioteca.run(3, 1);

    insertResena.run('Una obra maestra. Duro pero justo.', 5, 1, 1);
    insertResena.run('Me hizo comprar un control nuevo.', 4, 1, 3);
    insertResena.run('Hermoso arte, jugabilidad increíble.', 5, 2, 1);
    insertResena.run('El mejor juego de granja que existe.', 5, 3, 2);
    insertResena.run('Lloré, reí, volví a llorar.', 5, 4, 2);
    insertResena.run('Un clásico atemporal.', 5, 5, 1);
    insertResena.run('Me perdí 200 horas sin darme cuenta.', 5, 6, 3);

    const hoy = new Date();
    const dentroDeUnMes = new Date();
    dentroDeUnMes.setMonth(hoy.getMonth() + 1);

    const fmt = (d) => d.toISOString().split('T')[0];

    insertOferta.run(40, fmt(hoy), fmt(dentroDeUnMes), 5, 1);
  });

  transaction();
  console.log('Seed completado.');
}

module.exports = { seed };
