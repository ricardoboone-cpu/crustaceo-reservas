const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
app.use(express.json());

let db;

// 🔁 conexión con retry
function connectWithRetry() {
  db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'reservas_db'
  });

  db.connect((err) => {
    if (err) {
      console.log('❌ MySQL no está listo, reintentando en 3 segundos...');
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log('✅ Conectado a MySQL');

      // crear tabla cuando ya conectó
      db.query(`
        CREATE TABLE IF NOT EXISTS reservas (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100),
          personas INT,
          fecha VARCHAR(50)
        )
      `);
    }
  });
}

connectWithRetry();

// endpoint para crear reserva
app.post('/reservar', (req, res) => {
  const { nombre, personas, fecha } = req.body;

  db.query(
    'INSERT INTO reservas (nombre, personas, fecha) VALUES (?, ?, ?)',
    [nombre, personas, fecha]
  );

  fs.appendFileSync('../logs/app.log',
    `[${new Date()}] INFO: Reserva de ${nombre}\n`
  );

  res.send('Reserva realizada');
});

// endpoint para ver reservas
app.get('/reservas', (req, res) => {
  db.query('SELECT * FROM reservas', (err, results) => {
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log('Backend corriendo en puerto 5000');
});