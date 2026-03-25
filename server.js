require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Backend corriendo correctamente.",
    docs: {
      health: "/health",
      dbCheck: "/health/db",
      personas: "/api/personas",
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
    res.json(result.rows);
  } catch (error) {
    next(error);
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
