function crearEstadisticaService(db) {

  async function obtener() {

    const jugadores =
      await db.all(`
        SELECT *
        FROM jugadores
      `);


    return jugadores.map(
      jugador => {

        const partidos =
          Number(
            jugador.partidos
          );


        return {

          ...jugador,

          ppg:
            partidos > 0
              ? jugador.puntos /
                partidos
              : 0,

          rpg:
            partidos > 0
              ? jugador.rebotes /
                partidos
              : 0,

          apg:
            partidos > 0
              ? jugador.asistencias /
                partidos
              : 0
        };
      }
    );
  }


  return {
    obtener
  };
}


module.exports =
  crearEstadisticaService;