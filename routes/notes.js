import express from "express";
const router = express.Router();
import fetchUser from "../middleware/fetchUser.js";
import Notes from "../models/notes.js";
import { body, validationResult } from "express-validator";
//Route:1 Fetch all notes from the user using get.Login Requried
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.stauts(404).json({ error: error.message });
  }
});

//Route:2 Create a note using post. Login requried again using jwt we use that token
router.post(
  "/createnote",
  fetchUser,
  [
    body("title", "Please enter the title").isLength({ min: 3 }),
    body("description", "Please enter the description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tags } = req.body;
    try {
      const note = new Notes({ title, description, tags, user: req.user.id });
      const newNote = await note.save();
      if (newNote) {
        console.log("Sucess:New note created");
        return res
          .status(200)
          .json({ Sucess: "New note created", note: newNote });
      }
    } catch (error) {
      res.json({ error: error.message });
    }
  }
);

//Route:3 Update a existing note using post
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tags) {
      newNote.tags = tags;
    }

    let noteExist = await Notes.findById(req.params.id);
    if (!noteExist) {
      return res.status(404).send("Not Found");
    }
    if (noteExist.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    noteExist = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(noteExist);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//Route:4 Delete a note
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    let noteExist = await Notes.findById(req.params.id);
    if (!noteExist) {
      return res.status(404).send("Not Found");
    }
    if (noteExist.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    noteExist = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note deleted successfully", note: noteExist });
  } catch (error) {
    res.json({ error: error.message });
  }
});
export default router;
