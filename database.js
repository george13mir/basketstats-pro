const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./basketstats.db", (err) => {
  if (err) {
    console.error(
      "Error al conectar con la base de datos:",
      err.message
    );
  } else {
    console.log(
      "Base de datos conectada correctamente."
    );
  }
});

db.serialize(() => {

  // Activar claves foráneas
  db.run("PRAGMA foreign_keys = ON");


  // ============================
  // TABLA JUGADORES
  // ============================

  db.run(`
    CREATE TABLE IF NOT EXISTS jugadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      numero INTEGER NOT NULL,
      posicion TEXT NOT NULL,
      edad INTEGER DEFAULT 0,
      altura REAL DEFAULT 0,
      estado TEXT DEFAULT 'Activo',
      partidos INTEGER DEFAULT 0,
      puntos INTEGER DEFAULT 0,
      rebotes INTEGER DEFAULT 0,
      asistencias INTEGER DEFAULT 0,
      robos INTEGER DEFAULT 0
    )
  `);


  // Para bases antiguas que todavía
  // no tengan la columna estado
  db.run(`
    ALTER TABLE jugadores
    ADD COLUMN estado TEXT DEFAULT 'Activo'
  `, (err) => {

    if (
      err &&
      !err.message.includes(
        "duplicate column name"
      )
    ) {
      console.error(
        "Error agregando columna estado:",
        err.message
      );
    }

  });


  // ============================
  // TABLA PARTIDOS
  // ============================

  db.run(`
    CREATE TABLE IF NOT EXISTS partidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rival TEXT NOT NULL,
      fecha TEXT NOT NULL,
      puntos_equipo INTEGER DEFAULT 0,
      puntos_rival INTEGER DEFAULT 0,
      lugar TEXT DEFAULT '',
      observaciones TEXT DEFAULT ''
    )
  `);


  // ============================
  // TABLA ENTRENAMIENTOS
  // ============================

  db.run(`
    CREATE TABLE IF NOT EXISTS entrenamientos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      tipo TEXT NOT NULL,
      duracion INTEGER DEFAULT 0,
      lugar TEXT DEFAULT '',
      observaciones TEXT DEFAULT ''
    )
  `);


  // ============================
  // TABLA ASISTENCIA
  // ============================

  db.run(`
    CREATE TABLE IF NOT EXISTS asistencia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entrenamiento_id INTEGER NOT NULL,
      jugador_id INTEGER NOT NULL,
      estado TEXT DEFAULT 'Presente',

      UNIQUE(
        entrenamiento_id,
        jugador_id
      ),

      FOREIGN KEY (
        entrenamiento_id
      )
      REFERENCES entrenamientos(id)
      ON DELETE CASCADE,

      FOREIGN KEY (
        jugador_id
      )
      REFERENCES jugadores(id)
      ON DELETE CASCADE
    )
  `);


  // ============================
  // TABLA LESIONES
  // ============================

  db.run(`
    CREATE TABLE IF NOT EXISTS lesiones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jugador_id INTEGER NOT NULL,
      tipo_lesion TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_estimada TEXT DEFAULT '',
      estado TEXT DEFAULT 'En recuperación',
      observaciones TEXT DEFAULT '',

      FOREIGN KEY (
        jugador_id
      )
      REFERENCES jugadores(id)
      ON DELETE CASCADE
    )
  `);

});

module.exports = db;