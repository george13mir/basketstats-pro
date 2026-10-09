let entrenamientos = [];


// ==============================
// CARGAR
// ==============================

async function cargarEntrenamientos() {

  try {

    const respuesta =
      await fetch(
        "/api/entrenamientos"
      );


    entrenamientos =
      await respuesta.json();


    mostrarEntrenamientos(
      entrenamientos
    );


  } catch (error) {

    console.error(
      "Error cargando entrenamientos:",
      error
    );
  }
}


// ==============================
// MOSTRAR
// ==============================

function mostrarEntrenamientos(lista) {

  const tabla =
    document.getElementById(
      "tablaEntrenamientos"
    );


  tabla.innerHTML = "";


  if (lista.length === 0) {

    tabla.innerHTML = `

      <tr>

        <td
          colspan="6"
          class="tabla-vacia"
        >

          No hay entrenamientos registrados.

        </td>

      </tr>
    `;

    return;
  }


  lista.forEach(
    entrenamiento => {

      tabla.innerHTML += `

        <tr>

          <td>

            <strong>
              ${formatearFecha(
                entrenamiento.fecha
              )}
            </strong>

          </td>


          <td>

            <span class="estado activo">

              ${entrenamiento.tipo}

            </span>

          </td>


          <td>

            ${entrenamiento.duracion}
            min

          </td>


          <td>

            ${entrenamiento.lugar ||
              "Sin especificar"}

          </td>


          <td>

            ${entrenamiento.observaciones ||
              "—"}

          </td>


          <td class="acciones-tabla">

            <button
              class="btn-ver"
              onclick="irAsistencia(
                ${entrenamiento.id}
              )"
            >
              Asistencia
            </button>


            <button
              class="btn-editar"
              onclick="editarEntrenamiento(
                ${entrenamiento.id}
              )"
            >
              Editar
            </button>


            <button
              class="btn-eliminar"
              onclick="eliminarEntrenamiento(
                ${entrenamiento.id}
              )"
            >
              Eliminar
            </button>

          </td>

        </tr>
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
      "formularioEntrenamiento"
    )
    .classList.remove(
      "oculto"
    );


  document
    .getElementById(
      "tituloEntrenamiento"
    )
    .textContent =
      "Nuevo entrenamiento";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function ocultarFormulario() {

  document
    .getElementById(
      "formularioEntrenamiento"
    )
    .classList.add(
      "oculto"
    );


  limpiarFormulario();
}


function limpiarFormulario() {

  document.getElementById(
    "entrenamientoId"
  ).value = "";


  document.getElementById(
    "fecha"
  ).value = "";


  document.getElementById(
    "tipo"
  ).value = "";


  document.getElementById(
    "duracion"
  ).value = "";


  document.getElementById(
    "lugar"
  ).value = "";


  document.getElementById(
    "observaciones"
  ).value = "";
}


// ==============================
// GUARDAR
// ==============================

async function guardarEntrenamiento() {

  const id =
    document.getElementById(
      "entrenamientoId"
    ).value;


  const entrenamiento = {

    fecha:
      document.getElementById(
        "fecha"
      ).value,

    tipo:
      document.getElementById(
        "tipo"
      ).value,

    duracion:
      Number(
        document.getElementById(
          "duracion"
        ).value
      ),

    lugar:
      document.getElementById(
        "lugar"
      ).value.trim(),

    observaciones:
      document.getElementById(
        "observaciones"
      ).value.trim()
  };


  if (
    !entrenamiento.fecha ||
    !entrenamiento.tipo
  ) {

    alert(
      "Ingrese la fecha y el tipo de entrenamiento."
    );

    return;
  }


  if (
    entrenamiento.duracion < 0
  ) {

    alert(
      "La duración no puede ser negativa."
    );

    return;
  }


  try {

    const url =
      id
        ? `/api/entrenamientos/${id}`
        : "/api/entrenamientos";


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
              entrenamiento
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

    await cargarEntrenamientos();


  } catch (error) {

    console.error(
      "Error guardando entrenamiento:",
      error
    );


    alert(
      "Ocurrió un error."
    );
  }
}


// ==============================
// EDITAR
// ==============================

function editarEntrenamiento(id) {

  const entrenamiento =
    entrenamientos.find(
      e => e.id === id
    );


  if (!entrenamiento) {
    return;
  }


  document.getElementById(
    "entrenamientoId"
  ).value =
    entrenamiento.id;


  document.getElementById(
    "fecha"
  ).value =
    entrenamiento.fecha;


  document.getElementById(
    "tipo"
  ).value =
    entrenamiento.tipo;


  document.getElementById(
    "duracion"
  ).value =
    entrenamiento.duracion;


  document.getElementById(
    "lugar"
  ).value =
    entrenamiento.lugar || "";


  document.getElementById(
    "observaciones"
  ).value =
    entrenamiento.observaciones ||
    "";


  document
    .getElementById(
      "tituloEntrenamiento"
    )
    .textContent =
      "Editar entrenamiento";


  document
    .getElementById(
      "formularioEntrenamiento"
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

async function eliminarEntrenamiento(id) {

  const confirmar =
    confirm(
      "¿Seguro que desea eliminar este entrenamiento?"
    );


  if (!confirmar) {
    return;
  }


  try {

    await fetch(
      `/api/entrenamientos/${id}`,
      {
        method: "DELETE"
      }
    );


    await cargarEntrenamientos();


  } catch (error) {

    console.error(
      "Error eliminando entrenamiento:",
      error
    );
  }
}


// ==============================
// ASISTENCIA
// ==============================

function irAsistencia(
  entrenamientoId
) {

  window.location.href =
    `asistencia.html?entrenamiento=${entrenamientoId}`;
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


// Iniciar
cargarEntrenamientos();