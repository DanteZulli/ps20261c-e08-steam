const { resetDb, initDb } = require('./db/init');
const { seed } = require('./db/seed');

resetDb();
initDb();
seed();

console.log('Base lista.');
process.exit(0);
