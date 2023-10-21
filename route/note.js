const express = require("express");
const {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} = require("../controller/note");

const { protect } = require("../middleware/auth");

const route = express.Router();

// API
// Route "/" -> Middleware (Validasi, Auth) -> Logic (Controller)
// (req, res, next)

route.get("/", protect, getAllNotes);
route.get("/:noteid", protect, getNoteById); // route/:nodeid -> req.body, req.query, req.params, req.user, req.headers
route.post("/", protect, createNote);
route.put("/:id", protect, updateNote);
route.delete("/:id", protect, deleteNote);

// localhost:3000/note/
// route.get("/", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//   });
// });

module.exports = route;
