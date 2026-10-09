let lesiones = [];

let jugadores = [];


// ==============================
// INICIAR
// ==============================

async function iniciar() {

  await cargarJugadores();

  await cargarLesiones();
}


// ==============================
// JUGADORES
// ==============================

async function cargarJugadores() {

  try {

    const respuesta =
      await fetch(
        "/api/jugadores"
      );


    jugadores =
      await respuesta.json();


    const select =
      document.getElementById(
        "jugadorId"
      );


    select.innerHTML = `

      <option value="">
        Seleccione un jugador
      </option>
    `;


    jugadores.forEach(
      jugador => {

        select.innerHTML += `

          <option value="${jugador.id}">

            #${jugador.numero}
            -
            ${jugador.nombre}
            ${jugador.apellido}

          </option>
        `;
      }
    );


  } catch (error) {

    console.error(
      "Error cargando jugadores:",
      error
    );
  }
}


// ==============================
// LESIONES
// ==============================

async function cargarLesiones() {

  try {

    const respuesta =
      await fetch(
        "/api/lesiones"
      );


    lesiones =
      await respuesta.json();


    mostrarLesiones(
      lesiones
    );


  } catch (error) {

    console.error(
      "Error cargando lesiones:",
      error
    );
  }
}


// ==============================
// MOSTRAR
// ==============================

function mostrarLesiones(lista) {

  const contenedor =
    document.getElementById(
      "listaLesiones"
    );


  contenedor.innerHTML = "";


  if (
    lista.length === 0
  ) {

    contenedor.innerHTML = `

      <div class="sin-datos">

        No hay lesiones registradas.

      </div>
    `;

    return;
  }


  lista.forEach(
    lesion => {

      let claseEstado =
        "lesion-activa";


      if (
        lesion.estado ===
        "Recuperado"
      ) {

        claseEstado =
          "lesion-recuperado";

      } else if (
        lesion.estado ===
        "Rehabilitación"
      ) {

        claseEstado =
          "lesion-rehabilitacion";
      }


      contenedor.innerHTML += `

        <article class="lesion-card">


          <div class="lesion-jugador">

            <div class="mini-avatar">
              ${lesion.numero}
            </div>


            <div>

              <strong>

                ${lesion.nombre}
                ${lesion.apellido}

              </strong>

              <span>
                ${lesion.posicion}
              </span>

            </div>

          </div>


          <div class="lesion-info">

            <span>
              Lesión
            </span>

            <strong>
              ${lesion.tipo_lesion}
            </strong>

          </div>


          <div class="lesion-info">

            <span>
              Inicio
            </span>

            <strong>

              ${formatearFecha(
                lesion.fecha_inicio
              )}

            </strong>

          </div>


          <div class="lesion-info">

            <span>
              Recuperación estimada
            </span>

            <strong>

              ${
                lesion.fecha_estimada
                  ? formatearFecha(
                      lesion.fecha_estimada
                    )
                  : "Sin fecha"
              }

            </strong>

          </div>


          <div>

            <span
              class="lesion-estado ${claseEstado}"
            >

              ${lesion.estado}

            </span>

          </div>


          <div class="acciones-tabla">

            <button
              class="btn-editar"
              onclick="editarLesion(
                ${lesion.id}
              )"
            >
              Editar
            </button>


            <button
              class="btn-eliminar"
              onclick="eliminarLesion(
                ${lesion.id}
              )"
            >
              Eliminar
            </button>

          </div>


        </article>
      `;
    }
  );
}


// ==============================
// FORMULARIO
// ==============================

function mostrarFormulario() {

  limpiarFormulario();


  document
    .getElementById(
      "formularioLesion"
    )
    .classList.remove(
      "oculto"
    );


  document
    .getElementById(
      "tituloLesion"
    )
    .textContent =
      "Nueva lesión";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function ocultarFormulario() {

  document
    .getElementById(
      "formularioLesion"
    )
    .classList.add(
      "oculto"
    );


  limpiarFormulario();
}


function limpiarFormulario() {

  document.getElementById(
    "lesionId"
  ).value = "";


  document.getElementById(
    "jugadorId"
  ).value = "";


  document.getElementById(
    "tipoLesion"
  ).value = "";


  document.getElementById(
    "fechaInicio"
  ).value = "";


  document.getElementById(
    "fechaEstimada"
  ).value = "";


  document.getElementById(
    "estadoLesion"
  ).value =
    "En recuperación";


  document.getElementById(
    "observaciones"
  ).value = "";
}


// ==============================
// GUARDAR
// ==============================

async function guardarLesion() {

  const id =
    document.getElementById(
      "lesionId"
    ).value;


  const lesion = {

    jugador_id:
      Number(
        document.getElementById(
          "jugadorId"
        ).value
      ),

    tipo_lesion:
      document.getElementById(
        "tipoLesion"
      ).value.trim(),

    fecha_inicio:
      document.getElementById(
        "fechaInicio"
      ).value,

    fecha_estimada:
      document.getElementById(
        "fechaEstimada"
      ).value,

    estado:
      document.getElementById(
        "estadoLesion"
      ).value,

    observaciones:
      document.getElementById(
        "observaciones"
      ).value.trim()
  };


  if (
    !lesion.jugador_id ||
    !lesion.tipo_lesion ||
    !lesion.fecha_inicio
  ) {

    alert(
      "Complete jugador, tipo de lesión y fecha."
    );

    return;
  }


  try {

    const url =
      id
        ? `/api/lesiones/${id}`
        : "/api/lesiones";


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
              lesion
            )
        }
      );


    const resultado =
      await respuesta.json();


    if (!respuesta.ok) {

      alert(
        resultado.mensaje ||
        "No fue posible guardar la lesión."
      );

      return;
    }


    ocultarFormulario();

    await cargarLesiones();


  } catch (error) {

    console.error(
      "Error guardando lesión:",
      error
    );
  }
}


// ==============================
// EDITAR
// ==============================

function editarLesion(id) {

  const lesion =
    lesiones.find(
      item =>
        item.id === id
    );


  if (!lesion) {
    return;
  }


  document.getElementById(
    "lesionId"
  ).value =
    lesion.id;


  document.getElementById(
    "jugadorId"
  ).value =
    lesion.jugador_id;


  document.getElementById(
    "tipoLesion"
  ).value =
    lesion.tipo_lesion;


  document.getElementById(
    "fechaInicio"
  ).value =
    lesion.fecha_inicio;


  document.getElementById(
    "fechaEstimada"
  ).value =
    lesion.fecha_estimada ||
    "";


  document.getElementById(
    "estadoLesion"
  ).value =
    lesion.estado;


  document.getElementById(
    "observaciones"
  ).value =
    lesion.observaciones ||
    "";


  document.getElementById(
    "tituloLesion"
  ).textContent =
    "Editar lesión";


  document
    .getElementById(
      "formularioLesion"
    )
    .classList.remove(
      "oculto"
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==============================
// ELIMINAR
// ==============================

async function eliminarLesion(id) {

  const confirmar =
    confirm(
      "¿Seguro que desea eliminar este registro?"
    );


  if (!confirmar) {
    return;
  }


  try {

    await fetch(
      `/api/lesiones/${id}`,
      {
        method: "DELETE"
      }
    );


    await cargarLesiones();


  } catch (error) {

    console.error(
      "Error eliminando lesión:",
      error
    );
  }
}


// ==============================
// FECHA
// ==============================

function formatearFecha(fecha) {

  if (!fecha) {
    return "";
  }


  const partes =
    fecha.split("-");


  if (
    partes.length !== 3
  ) {

    return fecha;
  }


  return (
    `${partes[2]}/` +
    `${partes[1]}/` +
    `${partes[0]}`
  );
}


iniciar();