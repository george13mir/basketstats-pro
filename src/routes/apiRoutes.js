const express =
  require("express");


function crearApiRoutes(
  servicios
) {

  const router =
    express.Router();


  const {
    jugadores,
    partidos,
    entrenamientos,
    asistencia,
    lesiones,
    dashboard,
    estadisticas
  } = servicios;


  // ==========================
  // JUGADORES
  // ==========================

  router.get(
    "/jugadores",

    asyncHandler(
      async (req, res) => {

        res.json(
          await jugadores
            .obtenerTodos()
        );
      }
    )
  );


  router.get(
    "/jugadores/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await jugadores
            .obtenerPorId(
              req.params.id
            )
        );
      }
    )
  );


  router.post(
    "/jugadores",

    asyncHandler(
      async (req, res) => {

        res.json(
          await jugadores
            .crear(
              req.body
            )
        );
      }
    )
  );


  router.put(
    "/jugadores/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await jugadores
            .actualizar(
              req.params.id,
              req.body
            )
        );
      }
    )
  );


  router.delete(
    "/jugadores/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await jugadores
            .eliminar(
              req.params.id
            )
        );
      }
    )
  );


  // ==========================
  // PARTIDOS
  // ==========================

  router.get(
    "/partidos",

    asyncHandler(
      async (req, res) => {

        res.json(
          await partidos
            .obtenerTodos()
        );
      }
    )
  );


  router.post(
    "/partidos",

    asyncHandler(
      async (req, res) => {

        res.json(
          await partidos
            .crear(
              req.body
            )
        );
      }
    )
  );


  router.put(
    "/partidos/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await partidos
            .actualizar(
              req.params.id,
              req.body
            )
        );
      }
    )
  );


  router.delete(
    "/partidos/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await partidos
            .eliminar(
              req.params.id
            )
        );
      }
    )
  );


  // ==========================
  // ENTRENAMIENTOS
  // ==========================

  router.get(
    "/entrenamientos",

    asyncHandler(
      async (req, res) => {

        res.json(
          await entrenamientos
            .obtenerTodos()
        );
      }
    )
  );


  router.post(
    "/entrenamientos",

    asyncHandler(
      async (req, res) => {

        res.json(
          await entrenamientos
            .crear(
              req.body
            )
        );
      }
    )
  );


  router.put(
    "/entrenamientos/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await entrenamientos
            .actualizar(
              req.params.id,
              req.body
            )
        );
      }
    )
  );


  router.delete(
    "/entrenamientos/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await entrenamientos
            .eliminar(
              req.params.id
            )
        );
      }
    )
  );


  // ==========================
  // ASISTENCIA
  // ==========================

  router.get(
    "/asistencia-resumen",

    asyncHandler(
      async (req, res) => {

        res.json(
          await asistencia
            .obtenerResumen()
        );
      }
    )
  );


  router.get(
    "/asistencia/:entrenamientoId",

    asyncHandler(
      async (req, res) => {

        res.json(
          await asistencia
            .obtenerPorEntrenamiento(
              req.params
                .entrenamientoId
            )
        );
      }
    )
  );


  router.post(
    "/asistencia/:entrenamientoId",

    asyncHandler(
      async (req, res) => {

        res.json(
          await asistencia
            .guardar(
              req.params
                .entrenamientoId,

              req.body
                .asistencias
            )
        );
      }
    )
  );


  // ==========================
  // LESIONES
  // ==========================

  router.get(
    "/lesiones",

    asyncHandler(
      async (req, res) => {

        res.json(
          await lesiones
            .obtenerTodas()
        );
      }
    )
  );


  router.post(
    "/lesiones",

    asyncHandler(
      async (req, res) => {

        res.json(
          await lesiones
            .crear(
              req.body
            )
        );
      }
    )
  );


  router.put(
    "/lesiones/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await lesiones
            .actualizar(
              req.params.id,
              req.body
            )
        );
      }
    )
  );


  router.delete(
    "/lesiones/:id",

    asyncHandler(
      async (req, res) => {

        res.json(
          await lesiones
            .eliminar(
              req.params.id
            )
        );
      }
    )
  );


  // ==========================
  // DASHBOARD
  // ==========================

  router.get(
    "/dashboard",

    asyncHandler(
      async (req, res) => {

        res.json(
          await dashboard
            .obtener()
        );
      }
    )
  );


  // ==========================
  // ESTADÍSTICAS
  // ==========================

  router.get(
    "/estadisticas",

    asyncHandler(
      async (req, res) => {

        res.json(
          await estadisticas
            .obtener()
        );
      }
    )
  );


  return router;
}


function asyncHandler(
  controlador
) {

  return function (
    req,
    res,
    next
  ) {

    Promise
      .resolve(
        controlador(
          req,
          res,
          next
        )
      )
      .catch(next);
  };
}


module.exports =
  crearApiRoutes;