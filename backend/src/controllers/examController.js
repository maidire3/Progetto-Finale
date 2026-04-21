import Exam from '../models/Exam.js';

function sanitizeExam(exam) {
  return {
    id: exam._id,
    subject: exam.subject,
    date: exam.date,
    location: exam.location,
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt
  };
}

async function getExams(req, res, next) {
  try {
    const exams = await Exam.find({ user: req.user._id }).sort({ date: 1, createdAt: 1 });

    return res.status(200).json({
      exams: exams.map(sanitizeExam)
    });
  } catch (error) {
    next(error);
  }
}

async function createExam(req, res, next) {
  try {
    const { subject, date, location = 'Da definire' } = req.body;
    const trimmedSubject = subject?.trim();
    const trimmedDate = date?.trim();

    if (!trimmedSubject || !trimmedDate) {
      return res.status(400).json({
        message: 'Materia e data sono obbligatorie.'
      });
    }

    const exam = await Exam.create({
      user: req.user._id,
      subject: trimmedSubject,
      date: trimmedDate,
      location: location?.trim() || 'Da definire'
    });

    return res.status(201).json({
      message: 'Esame creato con successo.',
      exam: sanitizeExam(exam)
    });
  } catch (error) {
    next(error);
  }
}

async function updateExam(req, res, next) {
  try {
    const { subject, date, location = 'Da definire' } = req.body;
    const trimmedSubject = subject?.trim();
    const trimmedDate = date?.trim();

    if (!trimmedSubject || !trimmedDate) {
      return res.status(400).json({
        message: 'Materia e data sono obbligatorie.'
      });
    }

    const exam = await Exam.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!exam) {
      return res.status(404).json({ message: 'Esame non trovato.' });
    }

    exam.subject = trimmedSubject;
    exam.date = trimmedDate;
    exam.location = location?.trim() || 'Da definire';

    const updatedExam = await exam.save();

    return res.status(200).json({
      message: 'Esame aggiornato con successo.',
      exam: sanitizeExam(updatedExam)
    });
  } catch (error) {
    next(error);
  }
}

async function deleteExam(req, res, next) {
  try {
    const exam = await Exam.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!exam) {
      return res.status(404).json({ message: 'Esame non trovato.' });
    }

    return res.status(200).json({
      message: 'Esame eliminato con successo.'
    });
  } catch (error) {
    next(error);
  }
}

export { createExam, deleteExam, getExams, sanitizeExam, updateExam };
