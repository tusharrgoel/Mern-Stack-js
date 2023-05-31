import mongoose from "mongoose";

const notesSchema = new Schema({
  tile: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Notes = mongoose.model("notes", notesSchema);

module.exports = Notes;
