require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendBadRequest(res, message) {
  return res.status(400).json({
    ok: false,
    message,
  });
}

function sendNotFound(res, resource) {
  return res.status(404).json({
    ok: false,
    message: `${resource} no encontrado.`,
  });
}

async function getById(res, next, query, id, resource) {
  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return sendNotFound(res, resource);
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
}

app.get("/", (_req, res) => {
  res.json({
    message: "Backend corriendo correctamente.",
    docs: {
      health: "/health",
      dbCheck: "/health/db",
      personas: "/api/personas",
      telefonos: "/api/telefonos",
      sedes: "/api/sedes",
      actividades: "/api/actividades",
      reservas: "/api/reservas",
      membresias: "/api/membresias",
      pagos: "/api/pagos",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "backend_est_bd_grp6",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health/db", async (_req, res, next) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json({
      ok: true,
      database: "connected",
      serverTime: result.rows[0].server_time,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/personas", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_persona, nombre, correo, fecha_nacimiento, direccion, rol FROM persona ORDER BY id_persona ASC"
    );

    return res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/personas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_persona invalido.");
  }

  try {
    const result = await pool.query(
      "SELECT id_persona, nombre, correo, fecha_nacimiento, direccion, rol FROM persona WHERE id_persona = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Persona");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/personas", async (req, res, next) => {
  const { nombre, correo, fecha_nacimiento, direccion, rol } = req.body;

  if (!nombre || !correo || !rol) {
    return sendBadRequest(res, "nombre, correo y rol son obligatorios.");
  }

  try {
    const result = await pool.query(
      `INSERT INTO persona (nombre, correo, fecha_nacimiento, direccion, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_persona, nombre, correo, fecha_nacimiento, direccion, rol`,
      [nombre, correo, fecha_nacimiento || null, direccion || null, rol]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/personas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, correo, fecha_nacimiento, direccion, rol } = req.body;

  if (!id) {
    return sendBadRequest(res, "id_persona invalido.");
  }

  if (!nombre || !correo || !rol) {
    return sendBadRequest(res, "nombre, correo y rol son obligatorios.");
  }

  try {
    const result = await pool.query(
      `UPDATE persona
       SET nombre = $1, correo = $2, fecha_nacimiento = $3, direccion = $4, rol = $5
       WHERE id_persona = $6
       RETURNING id_persona, nombre, correo, fecha_nacimiento, direccion, rol`,
      [nombre, correo, fecha_nacimiento || null, direccion || null, rol, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Persona");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/personas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_persona invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM persona WHERE id_persona = $1 RETURNING id_persona",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Persona");
    }

    return res.json({
      ok: true,
      message: "Persona eliminada correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/telefonos", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_telefono, id_persona, numero FROM telefono ORDER BY id_telefono ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/telefonos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_telefono invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_telefono, id_persona, numero FROM telefono WHERE id_telefono = $1",
    id,
    "Telefono"
  );
});

app.post("/api/telefonos", async (req, res, next) => {
  const { id_persona, numero } = req.body;

  if (!parseId(id_persona) || !numero) {
    return sendBadRequest(res, "id_persona y numero son obligatorios.");
  }

  try {
    const result = await pool.query(
      `INSERT INTO telefono (id_persona, numero)
       VALUES ($1, $2)
       RETURNING id_telefono, id_persona, numero`,
      [id_persona, numero]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/telefonos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, numero } = req.body;

  if (!id) {
    return sendBadRequest(res, "id_telefono invalido.");
  }

  if (!parseId(id_persona) || !numero) {
    return sendBadRequest(res, "id_persona y numero son obligatorios.");
  }

  try {
    const result = await pool.query(
      `UPDATE telefono
       SET id_persona = $1, numero = $2
       WHERE id_telefono = $3
       RETURNING id_telefono, id_persona, numero`,
      [id_persona, numero, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Telefono");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/telefonos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_telefono invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM telefono WHERE id_telefono = $1 RETURNING id_telefono",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Telefono");
    }

    return res.json({
      ok: true,
      message: "Telefono eliminado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/sedes", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_sede, nombre, direccion FROM sede ORDER BY id_sede ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/sedes/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_sede invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_sede, nombre, direccion FROM sede WHERE id_sede = $1",
    id,
    "Sede"
  );
});

app.post("/api/sedes", async (req, res, next) => {
  const { nombre, direccion } = req.body;

  if (!nombre || !direccion) {
    return sendBadRequest(res, "nombre y direccion son obligatorios.");
  }

  try {
    const result = await pool.query(
      `INSERT INTO sede (nombre, direccion)
       VALUES ($1, $2)
       RETURNING id_sede, nombre, direccion`,
      [nombre, direccion]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/sedes/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, direccion } = req.body;

  if (!id) {
    return sendBadRequest(res, "id_sede invalido.");
  }

  if (!nombre || !direccion) {
    return sendBadRequest(res, "nombre y direccion son obligatorios.");
  }

  try {
    const result = await pool.query(
      `UPDATE sede
       SET nombre = $1, direccion = $2
       WHERE id_sede = $3
       RETURNING id_sede, nombre, direccion`,
      [nombre, direccion, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Sede");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/sedes/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_sede invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM sede WHERE id_sede = $1 RETURNING id_sede",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Sede");
    }

    return res.json({
      ok: true,
      message: "Sede eliminada correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/actividades", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_actividad, nombre, horario, cupo_max, costo, id_sede FROM actividad ORDER BY id_actividad ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/actividades/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_actividad invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_actividad, nombre, horario, cupo_max, costo, id_sede FROM actividad WHERE id_actividad = $1",
    id,
    "Actividad"
  );
});

app.post("/api/actividades", async (req, res, next) => {
  const { nombre, horario, cupo_max, costo, id_sede } = req.body;

  if (!nombre || !horario || !cupo_max || costo === undefined) {
    return sendBadRequest(
      res,
      "nombre, horario, cupo_max y costo son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO actividad (nombre, horario, cupo_max, costo, id_sede)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_actividad, nombre, horario, cupo_max, costo, id_sede`,
      [nombre, horario, cupo_max, costo, id_sede || null]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/actividades/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, horario, cupo_max, costo, id_sede } = req.body;

  if (!id) {
    return sendBadRequest(res, "id_actividad invalido.");
  }

  if (!nombre || !horario || !cupo_max || costo === undefined) {
    return sendBadRequest(
      res,
      "nombre, horario, cupo_max y costo son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `UPDATE actividad
       SET nombre = $1, horario = $2, cupo_max = $3, costo = $4, id_sede = $5
       WHERE id_actividad = $6
       RETURNING id_actividad, nombre, horario, cupo_max, costo, id_sede`,
      [nombre, horario, cupo_max, costo, id_sede || null, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Actividad");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/actividades/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_actividad invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM actividad WHERE id_actividad = $1 RETURNING id_actividad",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Actividad");
    }

    return res.json({
      ok: true,
      message: "Actividad eliminada correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/reservas", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado FROM reserva ORDER BY id_reserva ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_reserva invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado FROM reserva WHERE id_reserva = $1",
    id,
    "Reserva"
  );
});

app.post("/api/reservas", async (req, res, next) => {
  const { id_persona, id_actividad, fecha_hora, estado, precio_aplicado } =
    req.body;

  if (!parseId(id_persona) || !parseId(id_actividad) || !fecha_hora || !estado) {
    return sendBadRequest(
      res,
      "id_persona, id_actividad, fecha_hora y estado son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO reserva (id_persona, id_actividad, fecha_hora, estado, precio_aplicado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado`,
      [id_persona, id_actividad, fecha_hora, estado, precio_aplicado || null]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/reservas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, id_actividad, fecha_hora, estado, precio_aplicado } =
    req.body;

  if (!id) {
    return sendBadRequest(res, "id_reserva invalido.");
  }

  if (!parseId(id_persona) || !parseId(id_actividad) || !fecha_hora || !estado) {
    return sendBadRequest(
      res,
      "id_persona, id_actividad, fecha_hora y estado son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `UPDATE reserva
       SET id_persona = $1, id_actividad = $2, fecha_hora = $3, estado = $4, precio_aplicado = $5
       WHERE id_reserva = $6
       RETURNING id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado`,
      [id_persona, id_actividad, fecha_hora, estado, precio_aplicado || null, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Reserva");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/reservas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_reserva invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM reserva WHERE id_reserva = $1 RETURNING id_reserva",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Reserva");
    }

    return res.json({
      ok: true,
      message: "Reserva eliminada correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/membresias", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_membresia, id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado FROM membresia ORDER BY id_membresia ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/membresias/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_membresia invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_membresia, id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado FROM membresia WHERE id_membresia = $1",
    id,
    "Membresia"
  );
});

app.post("/api/membresias", async (req, res, next) => {
  const { id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado } =
    req.body;

  if (
    !parseId(id_persona) ||
    !tipo_plan ||
    !fecha_inicio ||
    !fecha_fin ||
    costo === undefined
  ) {
    return sendBadRequest(
      res,
      "id_persona, tipo_plan, fecha_inicio, fecha_fin y costo son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO membresia (id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_membresia, id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado`,
      [id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado || null]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/membresias/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado } =
    req.body;

  if (!id) {
    return sendBadRequest(res, "id_membresia invalido.");
  }

  if (
    !parseId(id_persona) ||
    !tipo_plan ||
    !fecha_inicio ||
    !fecha_fin ||
    costo === undefined
  ) {
    return sendBadRequest(
      res,
      "id_persona, tipo_plan, fecha_inicio, fecha_fin y costo son obligatorios."
    );
  }

  try {
    const result = await pool.query(
      `UPDATE membresia
       SET id_persona = $1, tipo_plan = $2, fecha_inicio = $3, fecha_fin = $4, costo = $5, estado = $6
       WHERE id_membresia = $7
       RETURNING id_membresia, id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado`,
      [id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado || null, id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Membresia");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/membresias/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_membresia invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM membresia WHERE id_membresia = $1 RETURNING id_membresia",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Membresia");
    }

    return res.json({
      ok: true,
      message: "Membresia eliminada correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/pagos", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id_pago, id_reserva, id_membresia, fecha, monto, metodo, referencia FROM pago ORDER BY id_pago ASC"
    );
    res.json({
      ok: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/pagos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_pago invalido.");
  }

  return getById(
    res,
    next,
    "SELECT id_pago, id_reserva, id_membresia, fecha, monto, metodo, referencia FROM pago WHERE id_pago = $1",
    id,
    "Pago"
  );
});

app.post("/api/pagos", async (req, res, next) => {
  const { id_reserva, id_membresia, fecha, monto, metodo, referencia } =
    req.body;

  if (!fecha || monto === undefined) {
    return sendBadRequest(res, "fecha y monto son obligatorios.");
  }

  if (!id_reserva && !id_membresia) {
    return sendBadRequest(
      res,
      "Debes enviar id_reserva o id_membresia."
    );
  }

  try {
    const result = await pool.query(
      `INSERT INTO pago (id_reserva, id_membresia, fecha, monto, metodo, referencia)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_pago, id_reserva, id_membresia, fecha, monto, metodo, referencia`,
      [
        id_reserva || null,
        id_membresia || null,
        fecha,
        monto,
        metodo || null,
        referencia || null,
      ]
    );

    res.status(201).json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/pagos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_reserva, id_membresia, fecha, monto, metodo, referencia } =
    req.body;

  if (!id) {
    return sendBadRequest(res, "id_pago invalido.");
  }

  if (!fecha || monto === undefined) {
    return sendBadRequest(res, "fecha y monto son obligatorios.");
  }

  if (!id_reserva && !id_membresia) {
    return sendBadRequest(
      res,
      "Debes enviar id_reserva o id_membresia."
    );
  }

  try {
    const result = await pool.query(
      `UPDATE pago
       SET id_reserva = $1, id_membresia = $2, fecha = $3, monto = $4, metodo = $5, referencia = $6
       WHERE id_pago = $7
       RETURNING id_pago, id_reserva, id_membresia, fecha, monto, metodo, referencia`,
      [
        id_reserva || null,
        id_membresia || null,
        fecha,
        monto,
        metodo || null,
        referencia || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Pago");
    }

    return res.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error) {
    return next(error);
  }
});

app.delete("/api/pagos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return sendBadRequest(res, "id_pago invalido.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM pago WHERE id_pago = $1 RETURNING id_pago",
      [id]
    );

    if (result.rows.length === 0) {
      return sendNotFound(res, "Pago");
    }

    return res.json({
      ok: true,
      message: "Pago eliminado correctamente.",
    });
  } catch (error) {
    return next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    ok: false,
    message: "Ocurrio un error interno.",
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
