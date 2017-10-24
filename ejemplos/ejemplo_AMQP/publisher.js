'use strict';

const connectionPromise = require('./connectAMQP');

const q = 'tareas';

// Publicador
// IIFE Inmediatelly Invoked Function Expression
(async () => {

  // nos aseguramos de que está conectado
  const conn = await connectionPromise;

  // conectarnos a un canal
  const ch = await conn.createChannel();

  // conecto a una cola
  await ch.assertQueue(q, {
    durable: true // sobrevive a reinicios
  });

  // maximo teórico del tamaño de un mensaje:
  // 9,223,372,036,854,775,807 (8 millones de teras, creo)

  setInterval(() => {
    const mensaje = {
      tarea: 'tarea ' + Date.now()
    };
    // mandar mensaje
    const res = ch.sendToQueue(q, new Buffer(JSON.stringify(mensaje)), {
      persistent: true // para sobrevivir a reinicios
    });
    console.log(`publicado: ${mensaje.tarea} ${res}`);
  }, 100)

})().catch(err => console.error(err) );
