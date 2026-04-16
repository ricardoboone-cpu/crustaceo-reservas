const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

let db;

// 📁 CONFIGURACIÓN DE LOGS
const logDir = path.join(__dirname, 'logs');
const logPath = path.join(logDir, 'app.log');

// crear carpeta logs si no existe
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// función de log
function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${type}: ${message}\n`);
}

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
      console.log('❌ MySQL no está listo, reintentando...');
      log('Error conectando a MySQL', 'ERROR');
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log('✅ Conectado a MySQL');
      log('Conectado a MySQL');

      // crear tabla si no existe
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
    [nombre, personas, fecha],
    (err) => {
      if (err) {
        log(`Error al guardar reserva de ${nombre}`, 'ERROR');
        return res.status(500).send('Error al guardar reserva');
      }

      log(`Reserva creada por ${nombre}`);
      res.send('Reserva realizada');
    }
  );
});

// endpoint para ver reservas
app.get('/reservas', (req, res) => {
  db.query('SELECT * FROM reservas', (err, results) => {
    if (err) {
      log('Error al obtener reservas', 'ERROR');
      return res.status(500).send('Error');
    }

    log('Consulta de reservas');
    res.json(results);
  });
});

// iniciar servidor
app.listen(5000, () => {
  console.log('Backend corriendo en puerto 5000');
  log('Servidor iniciado en puerto 5000');
});