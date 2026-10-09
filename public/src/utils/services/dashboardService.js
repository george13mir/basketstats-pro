function crearDashboardService(db) {

  async function obtener() {

    const jugadores =
      await db.all(`
        SELECT *
        FROM jugadores
      `);


    const partidos =
      await db.all(`
        SELECT *
        FROM partidos
        ORDER BY fecha DESC, id DESC
      `);


    const entrenamientos =
      await db.all(`
        SELECT *
        FROM entrenamientos
        ORDER BY fecha DESC, id DESC
      `);


    const lesionesData =
      await db.get(`
        SELECT
          COUNT(*) AS total
        FROM lesiones
        WHERE
          estado != 'Recuperado'
      `);


    const jugadoresCalculados =
      jugadores.map(
        calcularPromedios
      );


    const rankingPuntos =
      ordenar(
        jugadoresCalculados,
        "promedioPuntos"
      );


    const rankingRebotes =
      ordenar(
        jugadoresCalculados,
        "promedioRebotes"
      );


    const rankingAsistencias =
      ordenar(
        jugadoresCalculados,
        "promedioAsistencias"
      );


    const victorias =
      partidos.filter(
        partido =>
          partido.puntos_equipo >
          partido.puntos_rival
      ).length;


    const derrotas =
      partidos.filter(
        partido =>
          partido.puntos_equipo <
          partido.puntos_rival
      ).length;


    const empates =
      partidos.filter(
        partido =>
          partido.puntos_equipo ===
          partido.puntos_rival
      ).length;


    const porcentajeVictorias =
      partidos.length > 0

        ? (
            victorias /
            partidos.length *
            100
          ).toFixed(1)

        : "0.0";


    return {

      totalJugadores:
        jugadores.length,

      jugadoresActivos:
        jugadores.filter(
          j =>
            j.estado === "Activo"
        ).length,

      jugadoresLesionados:
        jugadores.filter(
          j =>
            j.estado === "Lesionado"
        ).length,

      totalPartidos:
        partidos.length,

      totalEntrenamientos:
        entrenamientos.length,

      lesionesActivas:
        Number(
          lesionesData.total
        ) || 0,

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
    };
  }


  function calcularPromedios(
    jugador
  ) {

    const partidos =
      Number(jugador.partidos);


    return {

      ...jugador,

      promedioPuntos:
        partidos > 0
          ? jugador.puntos /
            partidos
          : 0,

      promedioRebotes:
        partidos > 0
          ? jugador.rebotes /
            partidos
          : 0,

      promedioAsistencias:
        partidos > 0
          ? jugador.asistencias /
            partidos
          : 0
    };
  }


  function ordenar(
    jugadores,
    campo
  ) {

    return [
      ...jugadores
    ].sort(
      (a, b) =>
        b[campo] -
        a[campo]
    );
  }


  return {
    obtener
  };
}


module.exports =
  crearDashboardService;