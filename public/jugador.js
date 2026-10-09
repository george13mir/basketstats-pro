async function cargarJugador() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const id =
    params.get("id");


  if (!id) {
    mostrarError();
    return;
  }


  try {

    const respuesta =
      await fetch(
        `/api/jugadores/${id}`
      );


    if (!respuesta.ok) {
      mostrarError();
      return;
    }


    const jugador =
      await respuesta.json();


    mostrarFicha(jugador);


  } catch (error) {

    console.error(error);

    mostrarError();
  }
}


function mostrarFicha(jugador) {

  const ppg =
    jugador.partidos > 0
      ? (
          jugador.puntos /
          jugador.partidos
        ).toFixed(1)
      : "0.0";


  const rpg =
    jugador.partidos > 0
      ? (
          jugador.rebotes /
          jugador.partidos
        ).toFixed(1)
      : "0.0";


  const apg =
    jugador.partidos > 0
      ? (
          jugador.asistencias /
          jugador.partidos
        ).toFixed(1)
      : "0.0";


  let rendimiento = "Bajo";
  let clase = "bajo";


  if (Number(ppg) >= 15) {

    rendimiento = "Alto";
    clase = "alto";

  } else if (
    Number(ppg) >= 8
  ) {

    rendimiento = "Medio";
    clase = "medio";
  }


  document.getElementById(
    "fichaJugador"
  ).innerHTML = `

    <div class="perfil-jugador">

      <div class="dorsal-grande">

        <span>
          #
        </span>

        ${jugador.numero}

      </div>


      <div class="perfil-info">

        <span class="etiqueta">
          ${jugador.posicion}
        </span>

        <h2>
          ${jugador.nombre}
          ${jugador.apellido}
        </h2>

        <p>
          ${jugador.edad || 0} años
          · ${jugador.altura || 0} m
        </p>


        <div class="perfil-etiquetas">

          <span class="estado ${
            (jugador.estado || "Activo")
              .toLowerCase()
          }">

            ${jugador.estado || "Activo"}

          </span>


          <span class="rendimiento ${clase}">

            Rendimiento ${rendimiento}

          </span>

        </div>

      </div>

    </div>


    <div class="separador"></div>


    <h3 class="titulo-seccion">
      Estadísticas acumuladas
    </h3>


    <div class="stats-grid">

      <div class="stat-card">

        <span>
          Partidos
        </span>

        <strong>
          ${jugador.partidos}
        </strong>

      </div>


      <div class="stat-card">

        <span>
          Puntos
        </span>

        <strong>
          ${jugador.puntos}
        </strong>

      </div>


      <div class="stat-card">

        <span>
          Rebotes
        </span>

        <strong>
          ${jugador.rebotes}
        </strong>

      </div>


      <div class="stat-card">

        <span>
          Asistencias
        </span>

        <strong>
          ${jugador.asistencias}
        </strong>

      </div>


      <div class="stat-card">

        <span>
          Robos
        </span>

        <strong>
          ${jugador.robos}
        </strong>

      </div>

    </div>


    <h3 class="titulo-seccion">
      Promedios por partido
    </h3>


    <div class="promedios-grid">

      <div class="promedio-card principal">

        <span>
          Puntos por partido
        </span>

        <strong>
          ${ppg}
        </strong>

        <small>
          PTS/PJ
        </small>

      </div>


      <div class="promedio-card">

        <span>
          Rebotes por partido
        </span>

        <strong>
          ${rpg}
        </strong>

        <small>
          REB/PJ
        </small>

      </div>


      <div class="promedio-card">

        <span>
          Asistencias por partido
        </span>

        <strong>
          ${apg}
        </strong>

        <small>
          AST/PJ
        </small>

      </div>

    </div>
  `;
}


function mostrarError() {

  document.getElementById(
    "fichaJugador"
  ).innerHTML = `

    <div class="sin-datos">

      No se encontró el jugador.

    </div>
  `;
}


cargarJugador();