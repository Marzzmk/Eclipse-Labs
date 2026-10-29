const mongoose = require("mongoose");

// Una sesión es un inicio de sesión activo: "esta ficha pertenece a este admin
// y vale hasta tal fecha".
const esquemaSesion = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  expira: { type: Date, required: true },
});

// Índice TTL: MongoDB borra solo cada sesión cuando llega su fecha "expira".
// (Borra cada ~60 segundos, por eso el middleware también revisa la fecha.)
esquemaSesion.index({ expira: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Sesion", esquemaSesion);
