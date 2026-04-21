import Note from '../models/Note.js';

function sanitizeNote(note) {
  return {
    id: note._id,
    title: note.title,
    subject: note.subject || 'Generale',
    content: note.content || '',
    createdAt: note.createdAt,
    updatedAt: note.updatedAt
  };
}

async function getNotes(req, res, next) {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1, createdAt: -1 });

    return res.status(200).json({
      notes: notes.map(sanitizeNote)
    });
  } catch (error) {
    next(error);
  }
}

async function getNoteById(req, res, next) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Appunto non trovato.' });
    }

    return res.status(200).json({
      note: sanitizeNote(note)
    });
  } catch (error) {
    next(error);
  }
}

async function createNote(req, res, next) {
  try {
    const { title, subject = 'Generale', content = '' } = req.body;
    const trimmedTitle = title?.trim();
    const trimmedSubject = subject?.trim() || 'Generale';

    if (!trimmedTitle) {
      return res.status(400).json({
        message: 'Il titolo e obbligatorio.'
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title: trimmedTitle,
      subject: trimmedSubject,
      content: content?.trim() || ''
    });

    return res.status(201).json({
      message: 'Appunto creato con successo.',
      note: sanitizeNote(note)
    });
  } catch (error) {
    next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const { title, subject = 'Generale', content = '' } = req.body;
    const trimmedTitle = title?.trim();
    const trimmedSubject = subject?.trim() || 'Generale';

    if (!trimmedTitle) {
      return res.status(400).json({
        message: 'Il titolo e obbligatorio.'
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Appunto non trovato.' });
    }

    note.title = trimmedTitle;
    note.subject = trimmedSubject;
    note.content = content?.trim() || '';

    const updatedNote = await note.save();

    return res.status(200).json({
      message: 'Appunto aggiornato con successo.',
      note: sanitizeNote(updatedNote)
    });
  } catch (error) {
    next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({ message: 'Appunto non trovato.' });
    }

    return res.status(200).json({
      message: 'Appunto eliminato con successo.'
    });
  } catch (error) {
    next(error);
  }
}

export { createNote, deleteNote, getNoteById, getNotes, sanitizeNote, updateNote };
