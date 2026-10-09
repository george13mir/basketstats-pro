function crearEntrenamientoService(db) {

  async function obtenerTodos() {

    return await db.all(`
      SELECT *
      FROM entrenamientos
      ORDER BY fecha DESC, id DESC
    `);
  }


  async function crear(datos) {

    validar(datos);


    const resultado = await db.run(
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
        datos.fecha,
        datos.tipo,
        datos.duracion || 0,
        datos.lugar || "",
        datos.observaciones || ""
      ]
    );


    return {
      mensaje:
        "Entrenamiento registrado correctamente.",
      id: resultado.id
    };
  }


  async function actualizar(id, datos) {

    validar(datos);


    await db.run(
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
        datos.fecha,
        datos.tipo,
        datos.duracion || 0,
        datos.lugar || "",
        datos.observaciones || "",
        id
      ]
    );


    return {
      mensaje:
        "Entrenamiento actualizado correctamente."
    };
  }


  async function eliminar(id) {

    await db.run(
      `
      DELETE FROM entrenamientos
      WHERE id = ?
      `,
      [id]
    );


    return {
      mensaje:
        "Entrenamiento eliminado correctamente."
    };
  }


  function validar(datos) {

    if (
      !datos.fecha ||
      !datos.tipo
    ) {

      const error = new Error(
        "La fecha y el tipo de entrenamiento son obligatorios."
      );

      error.status = 400;

      throw error;
    }


    if (
      Number(datos.duracion) < 0
    ) {

      const error = new Error(
        "La duración no puede ser negativa."
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


module.exports = crearEntrenamientoService;