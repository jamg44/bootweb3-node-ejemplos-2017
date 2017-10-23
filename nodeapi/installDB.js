'use strict';

const conn = require('./lib/connectMongoose');
const Usuario = require('./models/Usuario');

conn.once('open', async function() {
  // uso try/catch para cazar los errores de async/await
  try {
    
    await initUsuarios();
    // otros inits ...
    conn.close();
    
  } catch(err) {
    console.log('Hubo un error:', err);
    process.exit(1);
  }
});

async function initUsuarios() {
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.result.n} usuarios.`);

  const inserted = await Usuario.insertMany([
    { name: 'admin', 
      email: 'admin@example.com',
      password: Usuario.hashPassword('1234') }
  ]);
  console.log(`Insertados ${inserted.length} usuarios.`);
}