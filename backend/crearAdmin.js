// Script para crear (o cambiar la contraseña de) el administrador.
// Se ejecuta UNA vez desde la terminal:   node crearAdmin.js
// No existe ninguna ruta pública para registrarse como admin: es a propósito.
require("dotenv").config();
const readline = require("readline/promises");
const mongoose = require("mongoose");

const Admin = require("./modelos/Admin");
const { crearHash } = require("./utilidades/seguridad");

async function principal() {
  if (!process.env.MONGODB_URI) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  const lector = readline.createInterface({ input: process.stdin, output: process.stdout });
  const usuario = (await lector.question("Usuario del administrador: ")).trim().toLowerCase();
  const clave = await lector.question("Contraseña (mínimo 10 caracteres; se verá mientras escribes): ");
  lector.close();

  if (usuario.length < 3) {
    console.error("El usuario debe tener al menos 3 caracteres.");
    process.exit(1);
  }
  if (clave.length < 10) {
    console.error("La contraseña debe tener al menos 10 caracteres.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const { sal, hash } = await crearHash(clave);
  // upsert: si el usuario ya existe le cambia la contraseña; si no, lo crea
  await Admin.findOneAndUpdate({ usuario }, { sal, hash }, { upsert: true });

  console.log(`Listo: el administrador "${usuario}" quedó guardado.`);
  await mongoose.disconnect();
}

principal().catch((error) => {
  console.error("No se pudo crear el administrador:", error.message);
  process.exit(1);
});
