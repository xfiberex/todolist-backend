import cron from "node-cron";
import Usuario from "../models/Usuario.js";
import Tarea from "../models/Tarea.js";

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL;

async function cleanOnce() {
  try {
    if (!DEMO_EMAIL) {
      console.log("[CRON] DEMO_USER_EMAIL no definida. Limpieza de tareas demo omitida.");
      return;
    }
    const usuario = await Usuario.findOne({ email: DEMO_EMAIL }).select("_id");
    if (!usuario) {
      console.log(`[CRON] Usuario demo no encontrado (${DEMO_EMAIL}). No hay tareas que limpiar.`);
      return;
    }
    const result = await Tarea.deleteMany({ creador: usuario._id });
    console.log(`[CRON] Limpieza tareas demo: ${result.deletedCount || 0} tareas eliminadas`);
  } catch (err) {
    console.error("[CRON] Error al limpiar tareas demo:", err?.message || err);
  }
}

export function startCleanupDemoTasks() {
  // Permite deshabilitar fácilmente en entornos específicos
  if (process.env.DISABLE_CRON === "1") {
    console.log("[CRON] Cron deshabilitado por variable DISABLE_CRON=1");
    return;
  }

  if (!DEMO_EMAIL) {
    console.log("[CRON] DEMO_USER_EMAIL no definida. Cron de limpieza de cuenta demo deshabilitado.");
    return;
  }

  const schedule = process.env.DEMO_CLEAN_SCHEDULE;
  const timezone = process.env.CRON_TZ;

  cron.schedule(
    schedule,
    () => {
      console.log("[CRON] Ejecutando limpieza de tareas demo...");
      cleanOnce();
    },
    { timezone }
  );

  // Opcional: ejecutar una vez al iniciar si la variable está activa
  if (process.env.CLEAN_DEMO_ON_STARTUP === "1") {
    console.log("[CRON] Limpieza inicial activada (CLEAN_DEMO_ON_STARTUP=1)");
    cleanOnce();
  }

  console.log(`[CRON] Programada limpieza diaria de tareas demo a las '${schedule}' (${timezone})`);
}

export default startCleanupDemoTasks;
