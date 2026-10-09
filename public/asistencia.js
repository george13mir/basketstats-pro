let entrenamientoActual = null;


// ==============================
// CARGAR ENTRENAMIENTOS
// ==============================

async function cargarEntrenamientos() {

  try {

    const respuesta =
      await fetch(
        "/api/entrenamientos"
      );


    const entrenamientos =
      await respuesta.json();


    const select =
      document.getElementById(
        "entrenamientoSelect"
      );


    select.innerHTML = `

      <option value="">
        Seleccione un entrenamiento
      </option>
    `;


    entrenamientos.forEach(
      entrenamiento => {

        select.innerHTML += `

          <option value="${entrenamiento.id}">

            ${formatearFecha(
              entrenamiento.fecha
            )}
            -
            ${entrenamiento.tipo}

          </option>
        `;
      }
    );


    const params =
      new URLSearchParams(
        window.location.search
      );


    const entrenamiento =
      params.get(
        "entrenamiento"
      );


    if (entrenamiento) {

      select.value =
        entrenamiento;

      await cargarAsistencia();
    }


  } catch (error) {

    console.error(
      "Error cargando entrenamientos:",
      error
    );
  }
}


// ==============================
// CARGAR ASISTENCIA
// ==============================

async function cargarAsistencia() {

  const id =
    document.getElementById(
      "entrenamientoSelect"
    ).value;


  const panel =
    document.getElementById(
      "panelAsistencia"
    );


  if (!id) {

    panel.classList.add(
      "oculto"
    );

    return;
  }


  entrenamientoActual = id;


  try {

    const respuesta =
      await fetch(
        `/api/asistencia/${id}`
      );


    const jugadores =
      await respuesta.json();


    mostrarAsistencia(
      jugadores
    );


    panel.classList.remove(
      "oculto"
    );


  } catch (error) {

    console.error(
      "Error cargando asistencia:",
      error
    );
  }
}


// ==============================
// MOSTRAR LISTA
// ==============================

function mostrarAsistencia(
  jugadores
) {

  const contenedor =
    document.getElementById(
      "listaAsistencia"
    );


  contenedor.innerHTML = "";


  if (
    jugadores.length === 0
  ) {

    contenedor.innerHTML = `

      <div class="sin-datos">

        No hay jugadores registrados.

      </div>
    `;

    return;
  }


  jugadores.forEach(
    jugador => {

      contenedor.innerHTML += `

        <div class="asistencia-card">

          <div class="jugador-asistencia">

            <div class="mini-avatar">
              ${jugador.numero}
            </div>


            <div>

              <strong>

                ${jugador.nombre}
                ${jugador.apellido}

              </strong>


              <span>

                ${jugador.posicion}

              </span>

            </div>

          </div>


          <select
            class="select-asistencia"
            data-jugador="${jugador.jugador_id}"
          >

            <option
              value="Presente"
              ${
                jugador.asistencia ===
                "Presente"
                  ? "selected"
                  : ""
              }
            >
              Presente
            </option>


            <option
              value="Ausente"
              ${
                jugador.asistencia ===
                "Ausente"
                  ? "selected"
                  : ""
              }
            >
              Ausente
            </option>


            <option
              value="Justificado"
              ${
                jugador.asistencia ===
                "Justificado"
                  ? "selected"
                  : ""
              }
            >
              Justificado
            </option>

          </select>

        </div>
      `;
    }
  );
}


// ==============================
// GUARDAR
// ==============================

async function guardarAsistencia() {

  if (
    !entrenamientoActual
  ) {

    alert(
      "Seleccione un entrenamiento."
    );

    return;
  }


  const selects =
    document.querySelectorAll(
      ".select-asistencia"
    );


  const asistencias =
    Array.from(selects)
      .map(select => ({

        jugador_id:
          Number(
            select.dataset.jugador
          ),

        estado:
          select.value
      }));


  try {

    const respuesta =
      await fetch(
        `/api/asistencia/${entrenamientoActual}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify({
              asistencias
            })
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


    alert(
      "Asistencia guardada correctamente."
    );


    await cargarResumen();


  } catch (error) {

    console.error(
      "Error guardando asistencia:",
      error
    );
  }
}


// ==============================
// RESUMEN
// ==============================

async function cargarResumen() {

  try {

    const respuesta =
      await fetch(
        "/api/asistencia-resumen"
      );


    const datos =
      await respuesta.json();


    const contenedor =
      document.getElementById(
        "resumenAsistencia"
      );


    if (
      datos.length === 0
    ) {

      contenedor.innerHTML = `

        <div class="sin-datos">

          No hay información de asistencia.

        </div>
      `;

      return;
    }


    let html = `

      <table>

        <thead>

          <tr>

            <th>
              Jugador
            </th>

            <th>
              Presente
            </th>

            <th>
              Ausente
            </th>

            <th>
              Justificado
            </th>

            <th>
              Asistencia
            </th>

          </tr>

        </thead>


        <tbody>
    `;


    datos.forEach(
      jugador => {

        html += `

          <tr>

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
                    ${jugador.posicion}
                  </small>

                </div>

              </div>

            </td>


            <td>
              ${jugador.presentes || 0}
            </td>


            <td>
              ${jugador.ausentes || 0}
            </td>


            <td>
              ${jugador.justificados || 0}
            </td>


            <td>

              <strong class="dato-destacado">

                ${jugador.porcentaje}%

              </strong>

            </td>

          </tr>
        `;
      }
    );


    html += `

        </tbody>

      </table>
    `;


    contenedor.innerHTML =
      html;


  } catch (error) {

    console.error(
      "Error cargando resumen:",
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


// Inicializar

cargarEntrenamientos();

cargarResumen();