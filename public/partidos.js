let partidos = [];


async function cargarPartidos() {

  try {

    const respuesta =
      await fetch("/api/partidos");

    partidos =
      await respuesta.json();

    mostrarPartidos(
      partidos
    );

  } catch (error) {

    console.error(
      "Error cargando partidos:",
      error
    );
  }
}


function mostrarPartidos(lista) {

  const contenedor =
    document.getElementById(
      "listaPartidos"
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


    if (
      partido.puntos_equipo >
      partido.puntos_rival
    ) {

      resultado = "Victoria";
      clase = "victoria";

    } else if (
      partido.puntos_equipo <
      partido.puntos_rival
    ) {

      resultado = "Derrota";
      clase = "derrota";
    }


    contenedor.innerHTML += `

      <article class="partido-card">

        <div class="partido-fecha">

          <span>
            ${formatearFecha(partido.fecha)}
          </span>

          <small>
            ${partido.lugar || "Sin lugar"}
          </small>

        </div>


        <div class="equipos-marcador">

          <div class="equipo">

            <span class="equipo-logo">
              BS
            </span>

            <strong>
              BasketStats
            </strong>

          </div>


          <div class="marcador">

            <strong>
              ${partido.puntos_equipo}
            </strong>

            <span>
              -
            </span>

            <strong>
              ${partido.puntos_rival}
            </strong>

          </div>


          <div class="equipo rival">

            <span class="equipo-logo rival-logo">
              ${iniciales(partido.rival)}
            </span>

            <strong>
              ${partido.rival}
            </strong>

          </div>

        </div>


        <div class="partido-final">

          <span class="resultado ${clase}">
            ${resultado}
          </span>


          <div>

            <button
              class="btn-editar"
              onclick="editarPartido(${partido.id})"
            >
              Editar
            </button>

            <button
              class="btn-eliminar"
              onclick="eliminarPartido(${partido.id})"
            >
              Eliminar
            </button>

          </div>

        </div>

      </article>
    `;
  });
}


function mostrarFormulario() {

  limpiarFormulario();

  document.getElementById(
    "tituloPartido"
  ).textContent =
    "Registrar partido";

  document.getElementById(
    "formularioPartido"
  ).classList.remove("oculto");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function ocultarFormulario() {

  document.getElementById(
    "formularioPartido"
  ).classList.add("oculto");

  limpiarFormulario();
}


function limpiarFormulario() {

  document.getElementById(
    "partidoId"
  ).value = "";

  document.getElementById(
    "rival"
  ).value = "";

  document.getElementById(
    "fecha"
  ).value = "";

  document.getElementById(
    "lugar"
  ).value = "";

  document.getElementById(
    "puntosEquipo"
  ).value = "";

  document.getElementById(
    "puntosRival"
  ).value = "";

  document.getElementById(
    "observaciones"
  ).value = "";
}


async function guardarPartido() {

  const id =
    document.getElementById(
      "partidoId"
    ).value;


  const partido = {

    rival:
      document.getElementById(
        "rival"
      ).value.trim(),

    fecha:
      document.getElementById(
        "fecha"
      ).value,

    lugar:
      document.getElementById(
        "lugar"
      ).value.trim(),

    puntos_equipo:
      Number(
        document.getElementById(
          "puntosEquipo"
        ).value
      ),

    puntos_rival:
      Number(
        document.getElementById(
          "puntosRival"
        ).value
      ),

    observaciones:
      document.getElementById(
        "observaciones"
      ).value.trim()
  };


  if (
    !partido.rival ||
    !partido.fecha
  ) {

    alert(
      "Ingrese rival y fecha."
    );

    return;
  }


  const url =
    id
      ? `/api/partidos/${id}`
      : "/api/partidos";


  const metodo =
    id
      ? "PUT"
      : "POST";


  const respuesta =
    await fetch(
      url,
      {
        method: metodo,

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(partido)
      }
    );


  if (!respuesta.ok) {

    alert(
      "No fue posible guardar el partido."
    );

    return;
  }


  ocultarFormulario();

  await cargarPartidos();
}


function editarPartido(id) {

  const partido =
    partidos.find(
      p => p.id === id
    );


  if (!partido) {
    return;
  }


  document.getElementById(
    "partidoId"
  ).value =
    partido.id;

  document.getElementById(
    "rival"
  ).value =
    partido.rival;

  document.getElementById(
    "fecha"
  ).value =
    partido.fecha;

  document.getElementById(
    "lugar"
  ).value =
    partido.lugar || "";

  document.getElementById(
    "puntosEquipo"
  ).value =
    partido.puntos_equipo;

  document.getElementById(
    "puntosRival"
  ).value =
    partido.puntos_rival;

  document.getElementById(
    "observaciones"
  ).value =
    partido.observaciones || "";


  document.getElementById(
    "tituloPartido"
  ).textContent =
    "Editar partido";


  document.getElementById(
    "formularioPartido"
  ).classList.remove("oculto");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


async function eliminarPartido(id) {

  const confirmar =
    confirm(
      "¿Eliminar este partido?"
    );


  if (!confirmar) {
    return;
  }


  await fetch(
    `/api/partidos/${id}`,
    {
      method: "DELETE"
    }
  );


  await cargarPartidos();
}


function formatearFecha(fecha) {

  const partes =
    fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function iniciales(nombre) {

  return nombre
    .split(" ")
    .slice(0, 2)
    .map(p => p[0])
    .join("")
    .toUpperCase();
}


cargarPartidos();