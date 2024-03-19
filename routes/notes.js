const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
// for Notes validation
const { body, validationResult } = require("express-validator");

// ROUTE 1: Fetch All Notes Using: get "/api/notes/fetchallnotes". login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const note = await Note.find({ user: req.user.id });
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add Notes Using: POST "/api/notes/addnotes". login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      savenotes = await note.save();
      res.json(savenotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
// ROUTE 3: Update an Existing Notes Using: PUT "/api/notes/updatenote". login required
// fetchuser is middleware
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  // create a newNote Object
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be updated an update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to Enter");
    }

    // For Updating Note
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: removing an Existing Notes Using: DELETE "/api/notes/removenote". login required
// fetchuser is middleware
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  // find the note to be Removed and Remove it
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Note not Found");
    }

    // Allw user only if he owns it
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed to Enter");
    }

    // For Updating Note
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been Deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
