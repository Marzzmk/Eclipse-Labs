const mongoose = require("mongoose");

const esquemaResena = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
      maxlength: [40, "El nombre es demasiado largo."],
    },
    puntuacion: {
      type: Number,
      required: [true, "La puntuación es obligatoria."],
      min: [1, "La puntuación debe ser de 1 a 5."],
      max: [5, "La puntuación debe ser de 1 a 5."],
      validate: {
        validator: Number.isInteger,
        message: "La puntuación debe ser un número entero.",
      },
    },
    comentario: {
      type: String,
      required: [true, "El comentario es obligatorio."],
      trim: true,
      maxlength: [300, "El comentario es demasiado largo."],
    },
    // Toda reseña nueva empieza sin aprobar. Solo el admin la podrá aprobar.
    aprobada: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resena", esquemaResena);