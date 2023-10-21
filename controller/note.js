const asyncFunc = require("../middleware/async");
const Note = require("../models").Note;
const User = require("../models").User;
const { Op } = require("sequelize");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllNotes = asyncFunc(async (req, res, next) => {
  // /note?id=123&title=asd
  // LIKE %title%
  // WHERE, JOIN, lEFT JOIN, RIGHT JOIN
  // "ini note 1"

  const checklist = req.query.checklist;
  const title = req.query.title;
  console.log(checklist, title);

  const condition = {};
  if (checklist) {
    if (checklist == "true") {
      condition.checklist = true;
    } else {
      condition.checklist = false;
    }
  }
  if (title) {
    condition.title = { [Op.like]: `%${title}%` };
  }

  const notes = await Note.findAll({
    where: condition,
    // attributes: ["id", "title", "checklist"],
    order: [["checklist", "ASC"]], // ASC / DESC
    // checklist asc false -> true / desc true -> false
    include: {
      model: User,
      as: "user",
      where: {
        id: req.user.id,
      },
    },
  });
  // SELECT * FROM note;
  // SELECT id, title FROM note;

  res.status(200).json({
    message: "Get All Notes",
    data: notes,
  });
});

exports.getNoteById = asyncFunc(async (req, res, next) => {
  // localhost/note/12345
  const id = req.params.noteid;
  console.log(id);

  const noteData = await Note.findByPk(id);

  // Check whether note is owned by user
  if (noteData.user_id !== req.user.id) {
    return next(new ErrorResponse("Unauthorized to access to note", 401));
  }

  res.status(200).json({
    message: "Get Note By Id",
    data: noteData,
  });
});

exports.createNote = asyncFunc(async (req, res, next) => {
  const { title, note } = req.body;

  // Validasi user_id tersebut bisa ditemukan tidak
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse("Not found", 404));
  }

  const noteData = await Note.create({
    title: title,
    note: note,
    checklist: false,
    user_id: user.id,
  });

  res.status(200).json({
    message: "Create Note",
    data: noteData,
  });
});

exports.updateNote = asyncFunc(async (req, res, next) => {
  // localhost/note/12345
  const id = req.params.id;
  const { title, note, checklist } = req.body;

  // Find Note Data
  const noteData = await Note.findByPk(id);

  // Check whether note is owned by user
  if (noteData.user_id !== req.user.id) {
    return next(new ErrorResponse("Unauthorized to access to note", 401));
  }

  noteData.title = title;
  noteData.note = note;
  noteData.checklist = checklist;
  noteData.save();

  res.status(200).json({
    message: "Update Note",
    data: noteData,
  });
});

exports.deleteNote = asyncFunc(async (req, res, next) => {
  const id = req.params.id;

  const noteData = await Note.findByPk(id);

  // Check whether note is owned by user
  if (noteData.user_id !== req.user.id) {
    return next(new ErrorResponse("Unauthorized to access to note", 401));
  }

  noteData.destroy();

  res.status(200).json({
    message: "Delete Note",
  });
});
