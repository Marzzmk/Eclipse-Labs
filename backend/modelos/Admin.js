const mongoose = require("mongoose");

// El administrador. Fíjate que NO hay un campo "clave": solo se guarda
// el hash de la contraseña y la sal con la que se calculó.
const esquemaAdmin = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true, // no puede haber dos administradores con el mismo usuario
      trim: true,
      lowercase: true,
    },
    sal: { type: String, required: true },
    hash: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", esquemaAdmin);
