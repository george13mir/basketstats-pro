function crearLesionService(db) {

  async function obtenerTodas() {

    return await db.all(`
      SELECT
        l.*,
        j.nombre,
        j.apellido,
        j.numero,
        j.posicion

      FROM lesiones l

      INNER JOIN jugadores j
      ON
        l.jugador_id = j.id

      ORDER BY
        l.fecha_inicio DESC,
        l.id DESC
    `);
  }


  async function crear(datos) {

    validar(datos);


    const resultado =
      await db.run(
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
          datos.jugador_id,
          datos.tipo_lesion,
          datos.fecha_inicio,
          datos.fecha_estimada || "",
          datos.estado ||
            "En recuperación",
          datos.observaciones || ""
        ]
      );


    await sincronizarEstadoJugador(
      datos.jugador_id,
      datos.estado ||
        "En recuperación"
    );


    return {
      mensaje:
        "Lesión registrada correctamente.",
      id: resultado.id
    };
  }


  async function actualizar(
    id,
    datos
  ) {

    validar(datos);


    await db.run(
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
        datos.jugador_id,
        datos.tipo_lesion,
        datos.fecha_inicio,
        datos.fecha_estimada || "",
        datos.estado ||
          "En recuperación",
        datos.observaciones || "",
        id
      ]
    );


    await sincronizarEstadoJugador(
      datos.jugador_id,
      datos.estado
    );


    return {
      mensaje:
        "Lesión actualizada correctamente."
    };
  }


  async function eliminar(id) {

    const lesion =
      await db.get(
        `
        SELECT jugador_id
        FROM lesiones
        WHERE id = ?
        `,
        [id]
      );


    await db.run(
      `
      DELETE FROM lesiones
      WHERE id = ?
      `,
      [id]
    );


    if (lesion) {

      const activas =
        await db.get(
          `
          SELECT
            COUNT(*) AS total
          FROM lesiones
          WHERE
            jugador_id = ?
            AND
            estado != 'Recuperado'
          `,
          [lesion.jugador_id]
        );


      if (
        Number(activas.total) === 0
      ) {

        await db.run(
          `
          UPDATE jugadores
          SET estado = 'Activo'
          WHERE id = ?
          `,
          [lesion.jugador_id]
        );
      }
    }


    return {
      mensaje:
        "Lesión eliminada correctamente."
    };
  }


  async function sincronizarEstadoJugador(
    jugadorId,
    estadoLesion
  ) {

    const estadoJugador =
      estadoLesion ===
      "Recuperado"
        ? "Activo"
        : "Lesionado";


    await db.run(
      `
      UPDATE jugadores
      SET estado = ?
      WHERE id = ?
      `,
      [
        estadoJugador,
        jugadorId
      ]
    );
  }


  function validar(datos) {

    if (
      !datos.jugador_id ||
      !datos.tipo_lesion ||
      !datos.fecha_inicio
    ) {

      const error =
        new Error(
          "Jugador, lesión y fecha son obligatorios."
        );

      error.status = 400;

      throw error;
    }
  }


  return {
    obtenerTodas,
    crear,
    actualizar,
    eliminar
  };
}


module.exports =
  crearLesionService;