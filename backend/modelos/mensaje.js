const mongoose = require("mongoose");

// Un "esquema" describe cómo es un documento: qué campos tiene,
// de qué tipo son y qué reglas deben cumplir antes de guardarse.
const esquemaMensaje = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
      maxlength: [80, "El nombre es demasiado largo."],
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio."],
      trim: true,
      maxlength: [120, "El correo es demasiado largo."],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "El correo no es válido."],
    },
    asunto: {
      type: String,
      required: [true, "El asunto es obligatorio."],
      trim: true,
      maxlength: [120, "El asunto es demasiado largo."],
    },
    mensaje: {
      type: String,
      required: [true, "El mensaje es obligatorio."],
      trim: true,
      maxlength: [1000, "El mensaje es demasiado largo."],
    },
  },
  // timestamps agrega solos los campos createdAt (fecha de creación) y updatedAt
  { timestamps: true }
);

// Un "modelo" es la herramienta para crear y buscar documentos con ese esquema.
// Mongoose guarda los mensajes en una colección llamada "mensajes".
module.exports = mongoose.model("Mensaje", esquemaMensaje);