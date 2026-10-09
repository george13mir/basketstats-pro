async function cargarEstadisticas() {

  try {

    const respuesta =
      await fetch(
        "/api/estadisticas"
      );


    const jugadores =
      await respuesta.json();


    mostrarPuntos(jugadores);

    mostrarRanking(
      jugadores,
      "rpg",
      "rankingRebotes",
      "REB/PJ"
    );

    mostrarRanking(
      jugadores,
      "apg",
      "rankingAsistencias",
      "AST/PJ"
    );


  } catch (error) {

    console.error(
      "Error cargando estadísticas:",
      error
    );
  }
}


function mostrarPuntos(jugadores) {

  const contenedor =
    document.getElementById(
      "graficoPuntos"
    );


  if (jugadores.length === 0) {

    contenedor.innerHTML = `
      <div class="sin-datos">
        No hay jugadores registrados.
      </div>
    `;

    return;
  }


  const ordenados =
    [...jugadores]
      .sort(
        (a, b) =>
          b.ppg - a.ppg
      );


  const maximo =
    Math.max(
      ...ordenados.map(
        j => j.ppg
      ),
      1
    );


  contenedor.innerHTML = "";


  ordenados.forEach(jugador => {

    const porcentaje =
      jugador.ppg /
      maximo *
      100;


    contenedor.innerHTML += `

      <div class="barra-fila">

        <div class="barra-jugador">

          <div class="mini-avatar">
            ${jugador.numero}
          </div>

          <span>
            ${jugador.nombre}
            ${jugador.apellido}
          </span>

        </div>


        <div class="barra-contenedor">

          <div
            class="barra-valor"
            style="width:${porcentaje}%"
          >
          </div>

        </div>


        <strong>
          ${jugador.ppg.toFixed(1)}
        </strong>

      </div>
    `;
  });
}


function mostrarRanking(
  jugadores,
  campo,
  contenedorId,
  unidad
) {

  const contenedor =
    document.getElementById(
      contenedorId
    );


  const ordenados =
    [...jugadores]
      .sort(
        (a, b) =>
          b[campo] - a[campo]
      )
      .slice(0, 5);


  if (ordenados.length === 0) {

    contenedor.innerHTML = `
      <div class="sin-datos">
        Sin datos.
      </div>
    `;

    return;
  }


  contenedor.innerHTML = "";


  ordenados.forEach(
    (jugador, indice) => {

      contenedor.innerHTML += `

        <div class="ranking-linea">

          <span class="ranking-numero">
            ${indice + 1}
          </span>

          <div>

            <strong>
              ${jugador.nombre}
              ${jugador.apellido}
            </strong>

            <small>
              ${jugador.posicion}
            </small>

          </div>

          <span class="ranking-valor">

            ${jugador[campo].toFixed(1)}

            <small>
              ${unidad}
            </small>

          </span>

        </div>
      `;
    }
  );
}


cargarEstadisticas();