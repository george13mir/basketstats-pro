async function cargarDashboard() {

  try {

    const respuesta =
      await fetch("/api/dashboard");

    const datos =
      await respuesta.json();


    document.getElementById(
      "totalJugadores"
    ).textContent =
      datos.totalJugadores;


    document.getElementById(
      "totalPartidos"
    ).textContent =
      datos.totalPartidos;


    document.getElementById(
      "victorias"
    ).textContent =
      datos.victorias;


    document.getElementById(
      "porcentajeVictorias"
    ).textContent =
      datos.porcentajeVictorias;


    document.getElementById(
      "jugadoresActivos"
    ).textContent =
      datos.jugadoresActivos;


    document.getElementById(
      "jugadoresLesionados"
    ).textContent =
      datos.jugadoresLesionados;


    cargarLideres(datos);

    mostrarTop3(
      datos.top3 || []
    );

    mostrarUltimosPartidos(
      datos.ultimosPartidos || []
    );


  } catch (error) {

    console.error(
      "Error cargando dashboard:",
      error
    );

  }
}


function cargarLideres(datos) {

  const anotador =
    datos.mejorAnotador;

  const reboteador =
    datos.mejorReboteador;

  const asistidor =
    datos.mejorAsistente;


  if (anotador) {

    document.getElementById(
      "liderPuntos"
    ).textContent =
      `${anotador.nombre} ${anotador.apellido}`;

    document.getElementById(
      "liderPuntosValor"
    ).textContent =
      `${anotador.promedioPuntos.toFixed(1)} PTS/PJ`;

  }


  if (reboteador) {

    document.getElementById(
      "liderRebotes"
    ).textContent =
      `${reboteador.nombre} ${reboteador.apellido}`;

    document.getElementById(
      "liderRebotesValor"
    ).textContent =
      `${reboteador.promedioRebotes.toFixed(1)} REB/PJ`;

  }


  if (asistidor) {

    document.getElementById(
      "liderAsistencias"
    ).textContent =
      `${asistidor.nombre} ${asistidor.apellido}`;

    document.getElementById(
      "liderAsistenciasValor"
    ).textContent =
      `${asistidor.promedioAsistencias.toFixed(1)} AST/PJ`;

  }
}


function mostrarTop3(lista) {

  const contenedor =
    document.getElementById(
      "topJugadores"
    );

  contenedor.innerHTML = "";


  if (lista.length === 0) {

    contenedor.innerHTML = `
      <div class="sin-datos">
        No hay jugadores registrados.
      </div>
    `;

    return;
  }


  const medallas =
    ["🥇", "🥈", "🥉"];


  lista.forEach(
    (jugador, indice) => {

      contenedor.innerHTML += `

        <div class="jugador-top">

          <div class="ranking-medalla">
            ${medallas[indice]}
          </div>

          <div class="avatar-jugador">
            ${jugador.numero}
          </div>

          <div class="info-jugador">

            <h3>
              ${jugador.nombre}
              ${jugador.apellido}
            </h3>

            <p>
              ${jugador.posicion}
              · #${jugador.numero}
            </p>

          </div>

          <div class="promedio-top">

            <strong>
              ${jugador.promedioPuntos.toFixed(1)}
            </strong>

            <span>
              PTS/PJ
            </span>

          </div>

        </div>
      `;

    }
  );
}


function mostrarUltimosPartidos(lista) {

  const contenedor =
    document.getElementById(
      "ultimosPartidos"
    );

  contenedor.innerHTML = "";


  if (lista.length === 0) {

    contenedor.innerHTML = `
      <div class="sin-datos">
        Todavía no hay partidos registrados.
      </div>
    `;

    return;
  }


  lista.forEach(partido => {

    let resultado = "Empate";
    let clase = "empate";
    let icono = "➖";


    if (
      partido.puntos_equipo >
      partido.puntos_rival
    ) {

      resultado = "Victoria";
      clase = "victoria";
      icono = "✓";

    } else if (
      partido.puntos_equipo <
      partido.puntos_rival
    ) {

      resultado = "Derrota";
      clase = "derrota";
      icono = "×";
    }


    contenedor.innerHTML += `

      <div class="partido-mini">

        <div>

          <span class="fecha-mini">
            ${formatearFecha(partido.fecha)}
          </span>

          <strong>
            vs ${partido.rival}
          </strong>

        </div>


        <div class="marcador-mini">

          ${partido.puntos_equipo}
          -
          ${partido.puntos_rival}

        </div>


        <span class="resultado ${clase}">
          ${icono} ${resultado}
        </span>

      </div>
    `;
  });
}


function formatearFecha(fecha) {

  if (!fecha) {
    return "";
  }

  const partes =
    fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


cargarDashboard();