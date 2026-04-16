const express = require('express');
const mongoose = require('mongoose'); // Cambiado de mysql2 a mongoose
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 📁 CONFIGURACIÓN DE LOGS (Se mantiene igual)
const logDir = path.join(__dirname, 'logs');
const logPath = path.join(logDir, 'app.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function log(message, type = "INFO") {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${type}: ${message}\n`);
}

// 🧱 MODELO DE DATOS (Equivalente al CREATE TABLE de SQL)
const ReservaSchema = new mongoose.Schema({
  nombre: String,
  personas: Number,
  fecha: String
});

const Reserva = mongoose.model('Reserva', ReservaSchema);

// 🔁 CONEXIÓN CON RETRY (Adaptada para MongoDB)
const mongoURI = process.env.MONGO_URI || 'mongodb://db:27017/reservas_db';

function connectWithRetry() {
  mongoose.connect(mongoURI)
    .then(() => {
      console.log('✅ Conectado a MongoDB');
      log('Conectado a MongoDB');
    })
    .catch((err) => {
      console.log('❌ MongoDB no está listo, reintentando...');
      log(`Error conectando a MongoDB: ${err.message}`, 'ERROR');
      setTimeout(connectWithRetry, 3000);
    });
}

connectWithRetry();

// ➕ Crear reserva (POST)
app.post('/reservar', async (req, res) => {
  const { nombre, personas, fecha } = req.body;

  if (!nombre || !personas || !fecha) {
    log('Datos incompletos', 'ERROR');
    return res.status(400).send('Datos incompletos');
  }

  try {
    const nuevaReserva = new Reserva({ nombre, personas, fecha });
    await nuevaReserva.save();
    log(`Reserva creada por ${nombre}`);
    res.send('Reserva realizada');
  } catch (err) {
    log(`Error al guardar reserva de ${nombre}`, 'ERROR');
    res.status(500).send('Error al guardar');
  }
});

// 📋 Obtener reservas (GET)
app.get('/reservas', async (req, res) => {
  try {
    const results = await Reserva.find(); // Equivalente al SELECT *
    log('Consulta de reservas');
    res.json(results);
  } catch (err) {
    log('Error al obtener reservas', 'ERROR');
    res.status(500).send('Error');
  }
});

// ❌ Eliminar reserva (DELETE)
app.delete('/reservas/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Reserva.findByIdAndDelete(id); // Equivalente al DELETE WHERE id = ?
    log(`Reserva ${id} eliminada`);
    res.send('Reserva eliminada');
  } catch (err) {
    log(`Error eliminando reserva ${id}`, 'ERROR');
    res.status(500).send('Error');
  }
});

// 🚀 Iniciar servidor
app.listen(3000, () => {
  console.log('Backend corriendo en puerto 3000');
  log('Servidor iniciado en puerto 3000');
});