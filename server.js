const express =
  require("express");

const path =
  require("path");

const dbOriginal =
  require("./database");


const crearDbAsync =
  require(
    "./src/utils/dbAsync"
  );


const crearJugadorService =
  require(
    "./src/services/jugadorService"
  );

const crearPartidoService =
  require(
    "./src/services/partidoService"
  );

const crearEntrenamientoService =
  require(
    "./src/services/entrenamientoService"
  );

const crearAsistenciaService =
  require(
    "./src/services/asistenciaService"
  );

const crearLesionService =
  require(
    "./src/services/lesionService"
  );

const crearDashboardService =
  require(
    "./src/services/dashboardService"
  );

const crearEstadisticaService =
  require(
    "./src/services/estadisticaService"
  );


const crearApiRoutes =
  require(
    "./src/routes/apiRoutes"
  );


const app =
  express();


const db =
  crearDbAsync(
    dbOriginal
  );


// ==============================
// SERVICIOS
// ==============================

const servicios = {

  jugadores:
    crearJugadorService(db),

  partidos:
    crearPartidoService(db),

  entrenamientos:
    crearEntrenamientoService(db),

  asistencia:
    crearAsistenciaService(db),

  lesiones:
    crearLesionService(db),

  dashboard:
    crearDashboardService(db),

  estadisticas:
    crearEstadisticaService(db)

};


// ==============================
// MIDDLEWARE
// ==============================

app.use(
  express.json()
);


app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);


// ==============================
// API
// ==============================

app.use(
  "/api",
  crearApiRoutes(
    servicios
  )
);


// ==============================
// MANEJO DE ERRORES
// ==============================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      err
    );


    res
      .status(
        err.status || 500
      )
      .json({

        mensaje:
          err.message ||
          "Error interno del servidor."

      });
  }
);


// ==============================
// SERVIDOR
// ==============================

const PORT = 3000;


app.listen(
  PORT,
  () => {

    console.log(
      "================================"
    );

    console.log(
      "🏀 BasketStats Pro"
    );

    console.log(
      `Servidor: http://localhost:${PORT}`
    );

    console.log(
      "Arquitectura SOLID activa ✅"
    );

    console.log(
      "================================"
    );
  }
);