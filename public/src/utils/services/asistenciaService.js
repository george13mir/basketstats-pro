function crearAsistenciaService(db) {

  async function obtenerPorEntrenamiento(
    entrenamientoId
  ) {

    return await db.all(
      `
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
      `,
      [entrenamientoId]
    );
  }


  async function guardar(
    entrenamientoId,
    asistencias
  ) {

    if (
      !Array.isArray(asistencias)
    ) {

      const error =
        new Error(
          "Formato de asistencia inválido."
        );

      error.status = 400;

      throw error;
    }


    for (
      const registro
      of asistencias
    ) {

      await db.run(
        `
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
        `,
        [
          entrenamientoId,
          registro.jugador_id,
          registro.estado
        ]
      );
    }


    return {
      mensaje:
        "Asistencia guardada correctamente."
    };
  }


  async function obtenerResumen() {

    const rows =
      await db.all(`
        SELECT
          j.id,
          j.nombre,
          j.apellido,
          j.numero,
          j.posicion,

          COUNT(a.id)
          AS registros,

          SUM(
            CASE
              WHEN
                a.estado = 'Presente'
              THEN 1
              ELSE 0
            END
          )
          AS presentes,

          SUM(
            CASE
              WHEN
                a.estado = 'Ausente'
              THEN 1
              ELSE 0
            END
          )
          AS ausentes,

          SUM(
            CASE
              WHEN
                a.estado = 'Justificado'
              THEN 1
              ELSE 0
            END
          )
          AS justificados

        FROM jugadores j

        LEFT JOIN asistencia a
        ON
          a.jugador_id = j.id

        GROUP BY j.id

        ORDER BY
          j.nombre,
          j.apellido
      `);


    return rows.map(row => {

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
  }


  return {
    obtenerPorEntrenamiento,
    guardar,
    obtenerResumen
  };
}


module.exports =
  crearAsistenciaService;