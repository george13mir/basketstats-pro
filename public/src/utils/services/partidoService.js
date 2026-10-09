function crearPartidoService(db) {

  async function obtenerTodos() {

    return await db.all(`
      SELECT *
      FROM partidos
      ORDER BY fecha DESC, id DESC
    `);
  }


  async function crear(datos) {

    validar(datos);


    const resultado =
      await db.run(
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
          datos.rival,
          datos.fecha,
          datos.puntos_equipo || 0,
          datos.puntos_rival || 0,
          datos.lugar || "",
          datos.observaciones || ""
        ]
      );


    return {
      mensaje:
        "Partido registrado correctamente.",
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
        datos.rival,
        datos.fecha,
        datos.puntos_equipo || 0,
        datos.puntos_rival || 0,
        datos.lugar || "",
        datos.observaciones || "",
        id
      ]
    );


    return {
      mensaje:
        "Partido actualizado correctamente."
    };
  }


  async function eliminar(id) {

    await db.run(
      `
      DELETE FROM partidos
      WHERE id = ?
      `,
      [id]
    );


    return {
      mensaje:
        "Partido eliminado correctamente."
    };
  }


  function validar(datos) {

    if (
      !datos.rival ||
      !datos.fecha
    ) {

      const error =
        new Error(
          "El rival y la fecha son obligatorios."
        );

      error.status = 400;

      throw error;
    }


    if (
      Number(datos.puntos_equipo) < 0 ||
      Number(datos.puntos_rival) < 0
    ) {

      const error =
        new Error(
          "Los puntos no pueden ser negativos."
        );

      error.status = 400;

      throw error;
    }
  }


  return {
    obtenerTodos,
    crear,
    actualizar,
    eliminar
  };
}


module.exports =
  crearPartidoService;