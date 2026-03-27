const { Router } = require("express");
const pool = require("../db");

const router = Router();

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendBadRequest(res, message) {
  return res.status(400).json({ ok: false, message });
}

function sendNotFound(res, resource) {
  return res.status(404).json({ ok: false, message: `${resource} no encontrado.` });
}

// PUT /api/personas/:id 
router.put("/personas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, correo, fecha_nacimiento, direccion, rol } = req.body;

  if (!id) return sendBadRequest(res, "id_persona invalido.");
  if (!nombre || !correo || !rol)
    return sendBadRequest(res, "nombre, correo y rol son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE persona
       SET nombre = $1, correo = $2, fecha_nacimiento = $3, direccion = $4, rol = $5
       WHERE id_persona = $6
       RETURNING id_persona, nombre, correo, fecha_nacimiento, direccion, rol`,
      [nombre, correo, fecha_nacimiento || null, direccion || null, rol, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Persona");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/telefonos/:id 
router.put("/telefonos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, numero } = req.body;

  if (!id) return sendBadRequest(res, "id_telefono invalido.");
  if (!parseId(id_persona) || !numero)
    return sendBadRequest(res, "id_persona y numero son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE telefono
       SET id_persona = $1, numero = $2
       WHERE id_telefono = $3
       RETURNING id_telefono, id_persona, numero`,
      [id_persona, numero, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Telefono");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/sedes/:id 
router.put("/sedes/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, direccion } = req.body;

  if (!id) return sendBadRequest(res, "id_sede invalido.");
  if (!nombre || !direccion)
    return sendBadRequest(res, "nombre y direccion son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE sede
       SET nombre = $1, direccion = $2
       WHERE id_sede = $3
       RETURNING id_sede, nombre, direccion`,
      [nombre, direccion, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Sede");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

//  PUT /api/actividades/:id 
router.put("/actividades/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { nombre, horario, cupo_max, costo, id_sede } = req.body;

  if (!id) return sendBadRequest(res, "id_actividad invalido.");
  if (!nombre || !horario || !cupo_max || costo === undefined)
    return sendBadRequest(res, "nombre, horario, cupo_max y costo son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE actividad
       SET nombre = $1, horario = $2, cupo_max = $3, costo = $4, id_sede = $5
       WHERE id_actividad = $6
       RETURNING id_actividad, nombre, horario, cupo_max, costo, id_sede`,
      [nombre, horario, cupo_max, costo, id_sede || null, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Actividad");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PATCH /api/reservas/:id/estado 
// Actualiza solo el estado de una reserva (creada ->  confirmada -> completada - > cancelada)
router.patch("/reservas/:id/estado", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { estado } = req.body;

  if (!id) return sendBadRequest(res, "id_reserva invalido.");

  const estadosValidos = ["creada", "confirmada", "completada", "cancelada"];
  if (!estado || !estadosValidos.includes(estado))
    return sendBadRequest(res, `estado debe ser: ${estadosValidos.join(", ")}.`);

  try {
    const result = await pool.query(
      `UPDATE reserva
       SET estado = $1
       WHERE id_reserva = $2
       RETURNING id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado`,
      [estado, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Reserva");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/reservas/:id 
// Actualiza todos los campos de una reserva
router.put("/reservas/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, id_actividad, fecha_hora, estado, precio_aplicado } = req.body;

  if (!id) return sendBadRequest(res, "id_reserva invalido.");
  if (!parseId(id_persona) || !parseId(id_actividad) || !fecha_hora || !estado)
    return sendBadRequest(res, "id_persona, id_actividad, fecha_hora y estado son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE reserva
       SET id_persona = $1, id_actividad = $2, fecha_hora = $3,
           estado = $4, precio_aplicado = $5
       WHERE id_reserva = $6
       RETURNING id_reserva, id_persona, id_actividad, fecha_hora, estado, precio_aplicado`,
      [id_persona, id_actividad, fecha_hora, estado, precio_aplicado || null, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Reserva");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/membresias/:id 
router.put("/membresias/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado } = req.body;

  if (!id) return sendBadRequest(res, "id_membresia invalido.");
  if (!parseId(id_persona) || !tipo_plan || !fecha_inicio || !fecha_fin || costo === undefined)
    return sendBadRequest(res, "id_persona, tipo_plan, fecha_inicio, fecha_fin y costo son obligatorios.");

  try {
    const result = await pool.query(
      `UPDATE membresia
       SET id_persona = $1, tipo_plan = $2, fecha_inicio = $3,
           fecha_fin = $4, costo = $5, estado = $6
       WHERE id_membresia = $7
       RETURNING id_membresia, id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado`,
      [id_persona, tipo_plan, fecha_inicio, fecha_fin, costo, estado || null, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Membresia");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

// PUT /api/pagos/:id
router.put("/pagos/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  const { id_reserva, id_membresia, fecha, monto, metodo, referencia } = req.body;

  if (!id) return sendBadRequest(res, "id_pago invalido.");
  if (!fecha || monto === undefined)
    return sendBadRequest(res, "fecha y monto son obligatorios.");
  if (!id_reserva && !id_membresia)
    return sendBadRequest(res, "Debes enviar id_reserva o id_membresia.");

  try {
    const result = await pool.query(
      `UPDATE pago
       SET id_reserva = $1, id_membresia = $2, fecha = $3,
           monto = $4, metodo = $5, referencia = $6
       WHERE id_pago = $7
       RETURNING id_pago, id_reserva, id_membresia, fecha, monto, metodo, referencia`,
      [id_reserva || null, id_membresia || null, fecha, monto, metodo || null, referencia || null, id]
    );

    if (result.rows.length === 0) return sendNotFound(res, "Pago");
    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
