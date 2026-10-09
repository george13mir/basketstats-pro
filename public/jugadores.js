let jugadores = [];


async function cargarJugadores() {

  try {

    const respuesta =
      await fetch("/api/jugadores");

    jugadores =
      await respuesta.json();

    mostrarJugadores(
      jugadores
    );

  } catch (error) {

    console.error(
      "Error cargando jugadores:",
      error
    );
  }
}


function mostrarJugadores(lista) {

  const tabla =
    document.getElementById(
      "tablaJugadores"
    );

  tabla.innerHTML = "";


  if (lista.length === 0) {

    tabla.innerHTML = `

      <tr>

        <td
          colspan="11"
          class="tabla-vacia"
        >

          No hay jugadores para mostrar.

        </td>

      </tr>
    `;

    return;
  }


  lista.forEach(jugador => {

    const promedio =
      jugador.partidos > 0
        ? (
            jugador.puntos /
            jugador.partidos
          ).toFixed(1)
        : "0.0";


    tabla.innerHTML += `

      <tr>

        <td>
          <span class="dorsal-tabla">
            #${jugador.numero}
          </span>
        </td>


        <td>

          <div class="jugador-tabla">

            <div class="mini-avatar">
              ${jugador.numero}
            </div>

            <div>

              <strong>
                ${jugador.nombre}
                ${jugador.apellido}
              </strong>

              <small>
                ${jugador.edad || 0} años
                · ${jugador.altura || 0} m
              </small>

            </div>

          </div>

        </td>


        <td>
          ${jugador.posicion}
        </td>


        <td>

          <span class="estado ${
            (jugador.estado || "Activo")
              .toLowerCase()
          }">

            ${jugador.estado || "Activo"}

          </span>

        </td>


        <td>
          ${jugador.partidos}
        </td>

        <td>
          ${jugador.puntos}
        </td>

        <td>
          ${jugador.rebotes}
        </td>

        <td>
          ${jugador.asistencias}
        </td>

        <td>
          ${jugador.robos}
        </td>


        <td>

          <strong class="dato-destacado">
            ${promedio}
          </strong>

        </td>


        <td class="acciones-tabla">

          <button
            class="btn-ver"
            onclick="verJugador(${jugador.id})"
          >
            Ver
          </button>

          <button
            class="btn-editar"
            onclick="editarJugador(${jugador.id})"
          >
            Editar
          </button>

          <button
            class="btn-eliminar"
            onclick="eliminarJugador(${jugador.id})"
          >
            Eliminar
          </button>

        </td>

      </tr>
    `;
  });
}


function verJugador(id) {

  window.location.href =
    `jugador.html?id=${id}`;
}


function mostrarFormulario() {

  limpiarFormulario();

  document
    .getElementById(
      "formularioJugador"
    )
    .classList.remove("oculto");

  document
    .getElementById(
      "tituloFormulario"
    )
    .textContent =
      "Nuevo jugador";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function ocultarFormulario() {

  document
    .getElementById(
      "formularioJugador"
    )
    .classList.add("oculto");

  limpiarFormulario();
}


function limpiarFormulario() {

  const ids = [
    "jugadorId",
    "nombre",
    "apellido",
    "numero",
    "edad",
    "altura",
    "partidos",
    "puntos",
    "rebotes",
    "asistencias",
    "robos"
  ];

  ids.forEach(id => {

    document.getElementById(id).value = "";

  });

  document.getElementById(
    "posicion"
  ).value = "";

  document.getElementById(
    "estado"
  ).value = "Activo";
}


async function guardarJugador() {

  const id =
    document.getElementById(
      "jugadorId"
    ).value;


  const jugador = {

    nombre:
      document.getElementById(
        "nombre"
      ).value.trim(),

    apellido:
      document.getElementById(
        "apellido"
      ).value.trim(),

    numero:
      Number(
        document.getElementById(
          "numero"
        ).value
      ),

    posicion:
      document.getElementById(
        "posicion"
      ).value,

    edad:
      Number(
        document.getElementById(
          "edad"
        ).value
      ),

    altura:
      Number(
        document.getElementById(
          "altura"
        ).value
      ),

    estado:
      document.getElementById(
        "estado"
      ).value,

    partidos:
      Number(
        document.getElementById(
          "partidos"
        ).value
      ),

    puntos:
      Number(
        document.getElementById(
          "puntos"
        ).value
      ),

    rebotes:
      Number(
        document.getElementById(
          "rebotes"
        ).value
      ),

    asistencias:
      Number(
        document.getElementById(
          "asistencias"
        ).value
      ),

    robos:
      Number(
        document.getElementById(
          "robos"
        ).value
      )
  };


  if (
    !jugador.nombre ||
    !jugador.apellido ||
    !jugador.numero ||
    !jugador.posicion
  ) {

    alert(
      "Complete nombre, apellido, camiseta y posición."
    );

    return;
  }


  try {

    const url =
      id
        ? `/api/jugadores/${id}`
        : "/api/jugadores";

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
            JSON.stringify(
              jugador
            )
        }
      );


    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      alert(
        resultado.mensaje ||
        "No fue posible guardar."
      );

      return;
    }


    ocultarFormulario();

    await cargarJugadores();


  } catch (error) {

    console.error(error);

    alert(
      "Error guardando jugador."
    );
  }
}


function editarJugador(id) {

  const jugador =
    jugadores.find(
      j => j.id === id
    );


  if (!jugador) {
    return;
  }


  document.getElementById(
    "jugadorId"
  ).value =
    jugador.id;

  document.getElementById(
    "nombre"
  ).value =
    jugador.nombre;

  document.getElementById(
    "apellido"
  ).value =
    jugador.apellido;

  document.getElementById(
    "numero"
  ).value =
    jugador.numero;

  document.getElementById(
    "posicion"
  ).value =
    jugador.posicion;

  document.getElementById(
    "edad"
  ).value =
    jugador.edad;

  document.getElementById(
    "altura"
  ).value =
    jugador.altura;

  document.getElementById(
    "estado"
  ).value =
    jugador.estado || "Activo";

  document.getElementById(
    "partidos"
  ).value =
    jugador.partidos;

  document.getElementById(
    "puntos"
  ).value =
    jugador.puntos;

  document.getElementById(
    "rebotes"
  ).value =
    jugador.rebotes;

  document.getElementById(
    "asistencias"
  ).value =
    jugador.asistencias;

  document.getElementById(
    "robos"
  ).value =
    jugador.robos;


  document.getElementById(
    "tituloFormulario"
  ).textContent =
    "Editar jugador";


  document
    .getElementById(
      "formularioJugador"
    )
    .classList.remove("oculto");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


async function eliminarJugador(id) {

  const confirmar =
    confirm(
      "¿Seguro que desea eliminar este jugador?"
    );


  if (!confirmar) {
    return;
  }


  await fetch(
    `/api/jugadores/${id}`,
    {
      method: "DELETE"
    }
  );


  await cargarJugadores();
}


function filtrarJugadores() {

  const texto =
    document.getElementById(
      "buscador"
    ).value
    .toLowerCase();


  const posicion =
    document.getElementById(
      "filtroPosicion"
    ).value;


  const filtrados =
    jugadores.filter(jugador => {

      const contenido =
        `
        ${jugador.nombre}
        ${jugador.apellido}
        ${jugador.numero}
        `
        .toLowerCase();


      const coincideTexto =
        contenido.includes(texto);


      const coincidePosicion =
        posicion === "" ||
        jugador.posicion === posicion;


      return (
        coincideTexto &&
        coincidePosicion
      );
    });


  mostrarJugadores(
    filtrados
  );
}


cargarJugadores();