import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"user"
  },
  title: {
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

export default Notes;
