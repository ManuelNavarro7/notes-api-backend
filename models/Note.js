const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
}); // modificamos los datos que envia la peticion que responde JSON y sacamos el _id y la __V

const Note = model("Note", noteSchema);

module.exports = Note;
