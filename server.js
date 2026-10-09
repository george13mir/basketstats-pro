const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


// ====================================================
// JUGADORES
// ====================================================


// Obtener todos
app.get(
  "/api/jugadores",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM jugadores
      ORDER BY id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json(rows);
      }
    );
  }
);


// Obtener uno
app.get(
  "/api/jugadores/:id",
  (req, res) => {

    db.get(
      `
      SELECT *
      FROM jugadores
      WHERE id = ?
      `,
      [req.params.id],
      (err, jugador) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        if (!jugador) {
          return res
            .status(404)
            .json({
              mensaje:
                "Jugador no encontrado."
            });
        }

        res.json(jugador);
      }
    );
  }
);


// Registrar
app.post(
  "/api/jugadores",
  (req, res) => {

    const {
      nombre,
      apellido,
      numero,
      posicion,
      edad,
      altura,
      estado,
      partidos,
      puntos,
      rebotes,
      asistencias,
      robos
    } = req.body;


    if (
      !nombre ||
      !apellido ||
      !numero ||
      !posicion
    ) {

      return res
        .status(400)
        .json({
          mensaje:
            "Complete nombre, apellido, número y posición."
        });
    }


    const sql = `
      INSERT INTO jugadores (
        nombre,
        apellido,
        numero,
        posicion,
        edad,
        altura,
        estado,
        partidos,
        puntos,
        rebotes,
        asistencias,
        robos
      )
      VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `;


    db.run(
      sql,
      [
        nombre,
        apellido,
        numero,
        posicion,
        edad || 0,
        altura || 0,
        estado || "Activo",
        partidos || 0,
        puntos || 0,
        rebotes || 0,
        asistencias || 0,
        robos || 0
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Jugador registrado correctamente.",
          id: this.lastID
        });
      }
    );
  }
);


// Actualizar
app.put(
  "/api/jugadores/:id",
  (req, res) => {

    const {
      nombre,
      apellido,
      numero,
      posicion,
      edad,
      altura,
      estado,
      partidos,
      puntos,
      rebotes,
      asistencias,
      robos
    } = req.body;


    const sql = `
      UPDATE jugadores
      SET
        nombre = ?,
        apellido = ?,
        numero = ?,
        posicion = ?,
        edad = ?,
        altura = ?,
        estado = ?,
        partidos = ?,
        puntos = ?,
        rebotes = ?,
        asistencias = ?,
        robos = ?
      WHERE id = ?
    `;


    db.run(
      sql,
      [
        nombre,
        apellido,
        numero,
        posicion,
        edad || 0,
        altura || 0,
        estado || "Activo",
        partidos || 0,
        puntos || 0,
        rebotes || 0,
        asistencias || 0,
        robos || 0,
        req.params.id
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Jugador actualizado correctamente."
        });
      }
    );
  }
);


// Eliminar
app.delete(
  "/api/jugadores/:id",
  (req, res) => {

    db.run(
      `
      DELETE FROM jugadores
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Jugador eliminado correctamente."
        });
      }
    );
  }
);


// ====================================================
// PARTIDOS
// ====================================================


// Obtener partidos
app.get(
  "/api/partidos",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM partidos
      ORDER BY fecha DESC, id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json(rows);
      }
    );
  }
);


// Registrar partido
app.post(
  "/api/partidos",
  (req, res) => {

    const {
      rival,
      fecha,
      puntos_equipo,
      puntos_rival,
      lugar,
      observaciones
    } = req.body;


    if (!rival || !fecha) {

      return res
        .status(400)
        .json({
          mensaje:
            "El rival y la fecha son obligatorios."
        });
    }


    db.run(
      `
      INSERT INTO partidos (
        rival,
        fecha,
        puntos_equipo,
        puntos_rival,
        lugar,
        observaciones
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        rival,
        fecha,
        puntos_equipo || 0,
        puntos_rival || 0,
        lugar || "",
        observaciones || ""
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Partido registrado correctamente.",
          id: this.lastID
        });
      }
    );
  }
);


// Editar partido
app.put(
  "/api/partidos/:id",
  (req, res) => {

    const {
      rival,
      fecha,
      puntos_equipo,
      puntos_rival,
      lugar,
      observaciones
    } = req.body;


    db.run(
      `
      UPDATE partidos
      SET
        rival = ?,
        fecha = ?,
        puntos_equipo = ?,
        puntos_rival = ?,
        lugar = ?,
        observaciones = ?
      WHERE id = ?
      `,
      [
        rival,
        fecha,
        puntos_equipo || 0,
        puntos_rival || 0,
        lugar || "",
        observaciones || "",
        req.params.id
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Partido actualizado correctamente."
        });
      }
    );
  }
);


// Eliminar partido
app.delete(
  "/api/partidos/:id",
  (req, res) => {

    db.run(
      `
      DELETE FROM partidos
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Partido eliminado correctamente."
        });
      }
    );
  }
);


// ====================================================
// ENTRENAMIENTOS
// ====================================================


// Obtener entrenamientos
app.get(
  "/api/entrenamientos",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM entrenamientos
      ORDER BY fecha DESC, id DESC
      `,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json(rows);
      }
    );
  }
);


// Registrar entrenamiento
app.post(
  "/api/entrenamientos",
  (req, res) => {

    const {
      fecha,
      tipo,
      duracion,
      lugar,
      observaciones
    } = req.body;


    if (!fecha || !tipo) {

      return res
        .status(400)
        .json({
          mensaje:
            "La fecha y el tipo de entrenamiento son obligatorios."
        });
    }


    db.run(
      `
      INSERT INTO entrenamientos (
        fecha,
        tipo,
        duracion,
        lugar,
        observaciones
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        fecha,
        tipo,
        duracion || 0,
        lugar || "",
        observaciones || ""
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Entrenamiento registrado correctamente.",
          id: this.lastID
        });
      }
    );
  }
);


// Editar entrenamiento
app.put(
  "/api/entrenamientos/:id",
  (req, res) => {

    const {
      fecha,
      tipo,
      duracion,
      lugar,
      observaciones
    } = req.body;


    db.run(
      `
      UPDATE entrenamientos
      SET
        fecha = ?,
        tipo = ?,
        duracion = ?,
        lugar = ?,
        observaciones = ?
      WHERE id = ?
      `,
      [
        fecha,
        tipo,
        duracion || 0,
        lugar || "",
        observaciones || "",
        req.params.id
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Entrenamiento actualizado correctamente."
        });
      }
    );
  }
);


// Eliminar entrenamiento
app.delete(
  "/api/entrenamientos/:id",
  (req, res) => {

    db.run(
      `
      DELETE FROM entrenamientos
      WHERE id = ?
      `,
      [req.params.id],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json({
          mensaje:
            "Entrenamiento eliminado correctamente."
        });
      }
    );
  }
);


// ====================================================
// ASISTENCIA
// ====================================================


// Obtener asistencia de un entrenamiento
app.get(
  "/api/asistencia/:entrenamientoId",
  (req, res) => {

    const entrenamientoId =
      req.params.entrenamientoId;


    const sql = `
      SELECT
        j.id AS jugador_id,
        j.nombre,
        j.apellido,
        j.numero,
        j.posicion,
        COALESCE(
          a.estado,
          'Sin registrar'
        ) AS asistencia
      FROM jugadores j

      LEFT JOIN asistencia a
      ON
        a.jugador_id = j.id
        AND
        a.entrenamiento_id = ?

      ORDER BY
        j.nombre,
        j.apellido
    `;


    db.all(
      sql,
      [entrenamientoId],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json(rows);
      }
    );
  }
);


// Guardar asistencia completa
app.post(
  "/api/asistencia/:entrenamientoId",
  (req, res) => {

    const entrenamientoId =
      req.params.entrenamientoId;

    const {
      asistencias
    } = req.body;


    if (
      !Array.isArray(asistencias)
    ) {

      return res
        .status(400)
        .json({
          mensaje:
            "Formato de asistencia inválido."
        });
    }


    const sql = `
      INSERT INTO asistencia (
        entrenamiento_id,
        jugador_id,
        estado
      )
      VALUES (?, ?, ?)

      ON CONFLICT(
        entrenamiento_id,
        jugador_id
      )
      DO UPDATE SET
        estado = excluded.estado
    `;


    db.serialize(() => {

      const stmt =
        db.prepare(sql);


      asistencias.forEach(
        registro => {

          stmt.run([
            entrenamientoId,
            registro.jugador_id,
            registro.estado
          ]);
        }
      );


      stmt.finalize((err) => {

        if (err) {

          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        res.json({
          mensaje:
            "Asistencia guardada correctamente."
        });
      });

    });
  }
);


// Resumen de asistencia por jugador
app.get(
  "/api/asistencia-resumen",
  (req, res) => {

    const sql = `
      SELECT
        j.id,
        j.nombre,
        j.apellido,
        j.numero,
        j.posicion,

        COUNT(a.id) AS registros,

        SUM(
          CASE
            WHEN a.estado = 'Presente'
            THEN 1
            ELSE 0
          END
        ) AS presentes,

        SUM(
          CASE
            WHEN a.estado = 'Ausente'
            THEN 1
            ELSE 0
          END
        ) AS ausentes,

        SUM(
          CASE
            WHEN a.estado = 'Justificado'
            THEN 1
            ELSE 0
          END
        ) AS justificados

      FROM jugadores j

      LEFT JOIN asistencia a
      ON a.jugador_id = j.id

      GROUP BY j.id

      ORDER BY
        j.nombre,
        j.apellido
    `;


    db.all(
      sql,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        const resultado =
          rows.map(row => {

            const registros =
              Number(row.registros) || 0;

            const presentes =
              Number(row.presentes) || 0;


            return {
              ...row,

              porcentaje:
                registros > 0
                  ? (
                      presentes /
                      registros *
                      100
                    ).toFixed(1)
                  : "0.0"
            };
          });


        res.json(resultado);
      }
    );
  }
);


// ====================================================
// LESIONES
// ====================================================


// Obtener lesiones
app.get(
  "/api/lesiones",
  (req, res) => {

    const sql = `
      SELECT
        l.*,

        j.nombre,
        j.apellido,
        j.numero,
        j.posicion

      FROM lesiones l

      INNER JOIN jugadores j
      ON l.jugador_id = j.id

      ORDER BY
        l.fecha_inicio DESC,
        l.id DESC
    `;


    db.all(
      sql,
      [],
      (err, rows) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }

        res.json(rows);
      }
    );
  }
);


// Registrar lesión
app.post(
  "/api/lesiones",
  (req, res) => {

    const {
      jugador_id,
      tipo_lesion,
      fecha_inicio,
      fecha_estimada,
      estado,
      observaciones
    } = req.body;


    if (
      !jugador_id ||
      !tipo_lesion ||
      !fecha_inicio
    ) {

      return res
        .status(400)
        .json({
          mensaje:
            "Jugador, lesión y fecha son obligatorios."
        });
    }


    db.run(
      `
      INSERT INTO lesiones (
        jugador_id,
        tipo_lesion,
        fecha_inicio,
        fecha_estimada,
        estado,
        observaciones
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        jugador_id,
        tipo_lesion,
        fecha_inicio,
        fecha_estimada || "",
        estado || "En recuperación",
        observaciones || ""
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        // Si la lesión está activa,
        // marcamos al jugador lesionado
        if (
          estado !== "Recuperado"
        ) {

          db.run(
            `
            UPDATE jugadores
            SET estado = 'Lesionado'
            WHERE id = ?
            `,
            [jugador_id]
          );
        }


        res.json({
          mensaje:
            "Lesión registrada correctamente.",
          id: this.lastID
        });
      }
    );
  }
);


// Editar lesión
app.put(
  "/api/lesiones/:id",
  (req, res) => {

    const {
      jugador_id,
      tipo_lesion,
      fecha_inicio,
      fecha_estimada,
      estado,
      observaciones
    } = req.body;


    db.run(
      `
      UPDATE lesiones
      SET
        jugador_id = ?,
        tipo_lesion = ?,
        fecha_inicio = ?,
        fecha_estimada = ?,
        estado = ?,
        observaciones = ?
      WHERE id = ?
      `,
      [
        jugador_id,
        tipo_lesion,
        fecha_inicio,
        fecha_estimada || "",
        estado || "En recuperación",
        observaciones || "",
        req.params.id
      ],
      function (err) {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        if (
          estado === "Recuperado"
        ) {

          db.run(
            `
            UPDATE jugadores
            SET estado = 'Activo'
            WHERE id = ?
            `,
            [jugador_id]
          );

        } else {

          db.run(
            `
            UPDATE jugadores
            SET estado = 'Lesionado'
            WHERE id = ?
            `,
            [jugador_id]
          );
        }


        res.json({
          mensaje:
            "Lesión actualizada correctamente."
        });
      }
    );
  }
);


// Eliminar lesión
app.delete(
  "/api/lesiones/:id",
  (req, res) => {

    db.get(
      `
      SELECT jugador_id
      FROM lesiones
      WHERE id = ?
      `,
      [req.params.id],
      (err, lesion) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        db.run(
          `
          DELETE FROM lesiones
          WHERE id = ?
          `,
          [req.params.id],
          function (err) {

            if (err) {
              return res
                .status(500)
                .json({
                  error: err.message
                });
            }


            if (lesion) {

              db.get(
                `
                SELECT COUNT(*) AS total
                FROM lesiones
                WHERE
                  jugador_id = ?
                  AND estado != 'Recuperado'
                `,
                [lesion.jugador_id],
                (err, row) => {

                  if (
                    !err &&
                    row.total === 0
                  ) {

                    db.run(
                      `
                      UPDATE jugadores
                      SET estado = 'Activo'
                      WHERE id = ?
                      `,
                      [lesion.jugador_id]
                    );
                  }

                }
              );
            }


            res.json({
              mensaje:
                "Lesión eliminada correctamente."
            });
          }
        );
      }
    );
  }
);


// ====================================================
// DASHBOARD
// ====================================================

app.get(
  "/api/dashboard",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM jugadores
      `,
      [],
      (err, jugadores) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        db.all(
          `
          SELECT *
          FROM partidos
          ORDER BY fecha DESC, id DESC
          `,
          [],
          (err, partidos) => {

            if (err) {
              return res
                .status(500)
                .json({
                  error: err.message
                });
            }


            db.all(
              `
              SELECT *
              FROM entrenamientos
              ORDER BY fecha DESC
              `,
              [],
              (err, entrenamientos) => {

                if (err) {
                  return res
                    .status(500)
                    .json({
                      error: err.message
                    });
                }


                db.get(
                  `
                  SELECT COUNT(*) AS total
                  FROM lesiones
                  WHERE estado != 'Recuperado'
                  `,
                  [],
                  (err, lesionesData) => {

                    if (err) {
                      return res
                        .status(500)
                        .json({
                          error: err.message
                        });
                    }


                    const conPromedios =
                      jugadores.map(j => ({

                        ...j,

                        promedioPuntos:
                          j.partidos > 0
                            ? j.puntos /
                              j.partidos
                            : 0,

                        promedioRebotes:
                          j.partidos > 0
                            ? j.rebotes /
                              j.partidos
                            : 0,

                        promedioAsistencias:
                          j.partidos > 0
                            ? j.asistencias /
                              j.partidos
                            : 0
                      }));


                    const rankingPuntos =
                      [...conPromedios]
                        .sort(
                          (a, b) =>
                            b.promedioPuntos -
                            a.promedioPuntos
                        );


                    const rankingRebotes =
                      [...conPromedios]
                        .sort(
                          (a, b) =>
                            b.promedioRebotes -
                            a.promedioRebotes
                        );


                    const rankingAsistencias =
                      [...conPromedios]
                        .sort(
                          (a, b) =>
                            b.promedioAsistencias -
                            a.promedioAsistencias
                        );


                    const victorias =
                      partidos.filter(
                        p =>
                          p.puntos_equipo >
                          p.puntos_rival
                      ).length;


                    const derrotas =
                      partidos.filter(
                        p =>
                          p.puntos_equipo <
                          p.puntos_rival
                      ).length;


                    const empates =
                      partidos.filter(
                        p =>
                          p.puntos_equipo ===
                          p.puntos_rival
                      ).length;


                    const porcentajeVictorias =
                      partidos.length > 0
                        ? (
                            victorias /
                            partidos.length *
                            100
                          ).toFixed(1)
                        : "0.0";


                    res.json({

                      totalJugadores:
                        jugadores.length,

                      jugadoresActivos:
                        jugadores.filter(
                          j =>
                            j.estado ===
                            "Activo"
                        ).length,

                      jugadoresLesionados:
                        jugadores.filter(
                          j =>
                            j.estado ===
                            "Lesionado"
                        ).length,

                      totalPartidos:
                        partidos.length,

                      totalEntrenamientos:
                        entrenamientos.length,

                      lesionesActivas:
                        lesionesData.total || 0,

                      victorias,

                      derrotas,

                      empates,

                      porcentajeVictorias,

                      mejorAnotador:
                        rankingPuntos[0] ||
                        null,

                      mejorReboteador:
                        rankingRebotes[0] ||
                        null,

                      mejorAsistente:
                        rankingAsistencias[0] ||
                        null,

                      top3:
                        rankingPuntos.slice(
                          0,
                          3
                        ),

                      ultimosPartidos:
                        partidos.slice(
                          0,
                          5
                        ),

                      ultimosEntrenamientos:
                        entrenamientos.slice(
                          0,
                          3
                        )

                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  }
);


// ====================================================
// ESTADÍSTICAS
// ====================================================

app.get(
  "/api/estadisticas",
  (req, res) => {

    db.all(
      `
      SELECT *
      FROM jugadores
      `,
      [],
      (err, jugadores) => {

        if (err) {
          return res
            .status(500)
            .json({
              error: err.message
            });
        }


        const datos =
          jugadores.map(j => ({

            ...j,

            ppg:
              j.partidos > 0
                ? j.puntos /
                  j.partidos
                : 0,

            rpg:
              j.partidos > 0
                ? j.rebotes /
                  j.partidos
                : 0,

            apg:
              j.partidos > 0
                ? j.asistencias /
                  j.partidos
                : 0
          }));


        res.json(datos);
      }
    );
  }
);


// ====================================================
// SERVIDOR
// ====================================================

const PORT = 3000;


app.listen(
  PORT,
  () => {

    console.log(
      `BasketStats funcionando en http://localhost:${PORT}`
    );

  }
);