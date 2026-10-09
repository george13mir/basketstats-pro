function crearJugadorService(db) {

  async function obtenerTodos() {

    return await db.all(`
      SELECT *
      FROM jugadores
      ORDER BY id DESC
    `);
  }


  async function obtenerPorId(id) {

    const jugador =
      await db.get(
        `
        SELECT *
        FROM jugadores
        WHERE id = ?
        `,
        [id]
      );


    if (!jugador) {

      const error =
        new Error(
          "Jugador no encontrado."
        );

      error.status = 404;

      throw error;
    }


    return jugador;
  }


  async function crear(datos) {

    validarJugador(datos);


    const resultado =
      await db.run(
        `
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
        `,
        [
          datos.nombre,
          datos.apellido,
          datos.numero,
          datos.posicion,
          datos.edad || 0,
          datos.altura || 0,
          datos.estado || "Activo",
          datos.partidos || 0,
          datos.puntos || 0,
          datos.rebotes || 0,
          datos.asistencias || 0,
          datos.robos || 0
        ]
      );


    return {
      mensaje:
        "Jugador registrado correctamente.",
      id: resultado.id
    };
  }


  async function actualizar(
    id,
    datos
  ) {

    validarJugador(datos);


    await obtenerPorId(id);


    await db.run(
      `
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
      `,
      [
        datos.nombre,
        datos.apellido,
        datos.numero,
        datos.posicion,
        datos.edad || 0,
        datos.altura || 0,
        datos.estado || "Activo",
        datos.partidos || 0,
        datos.puntos || 0,
        datos.rebotes || 0,
        datos.asistencias || 0,
        datos.robos || 0,
        id
      ]
    );


    return {
      mensaje:
        "Jugador actualizado correctamente."
    };
  }


  async function eliminar(id) {

    await obtenerPorId(id);


    await db.run(
      `
      DELETE FROM jugadores
      WHERE id = ?
      `,
      [id]
    );


    return {
      mensaje:
        "Jugador eliminado correctamente."
    };
  }


  function validarJugador(datos) {

    if (
      !datos.nombre ||
      !datos.apellido ||
      !datos.numero ||
      !datos.posicion
    ) {

      const error =
        new Error(
          "Complete nombre, apellido, número y posición."
        );

      error.status = 400;

      throw error;
    }


    if (
      Number(datos.numero) <= 0
    ) {

      const error =
        new Error(
          "El dorsal debe ser mayor a cero."
        );

      error.status = 400;

      throw error;
    }
  }


  return {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
  };
}


module.exports =
  crearJugadorService;