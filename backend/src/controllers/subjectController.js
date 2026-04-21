import Subject from '../models/Subject.js';

function sanitizeSubject(subject) {
  return {
    id: subject._id,
    name: subject.name,
    description: subject.description,
    color: subject.color,
    scheduleEnabled: subject.scheduleEnabled,
    scheduleDays: subject.scheduleDays,
    startTime: subject.startTime,
    endTime: subject.endTime,
    createdAt: subject.createdAt,
    updatedAt: subject.updatedAt
  };
}

function buildDefaultDescription(name) {
  return `Organizza lezioni, ripasso e task legati a ${name}.`;
}

async function getSubjects(req, res, next) {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      subjects: subjects.map(sanitizeSubject)
    });
  } catch (error) {
    next(error);
  }
}

async function createSubject(req, res, next) {
  try {
    const {
      name,
      color = 'sage',
      scheduleEnabled = false,
      scheduleDays = [],
      startTime = '09:00',
      endTime = '11:00'
    } = req.body;

    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: 'Il nome materia e obbligatorio.' });
    }

    const existingSubject = await Subject.findOne({
      user: req.user._id,
      name: { $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });

    if (existingSubject) {
      return res.status(400).json({ message: 'Esiste gia una materia con questo nome.' });
    }

    const subject = await Subject.create({
      user: req.user._id,
      name: trimmedName,
      description: buildDefaultDescription(trimmedName),
      color,
      scheduleEnabled,
      scheduleDays: scheduleEnabled ? scheduleDays : [],
      startTime,
      endTime
    });

    return res.status(201).json({
      message: 'Materia creata con successo.',
      subject: sanitizeSubject(subject)
    });
  } catch (error) {
    next(error);
  }
}

async function updateSubject(req, res, next) {
  try {
    const {
      name,
      color = 'sage',
      scheduleEnabled = false,
      scheduleDays = [],
      startTime = '09:00',
      endTime = '11:00'
    } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: 'Il nome materia e obbligatorio.' });
    }

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia non trovata.' });
    }

    const existingSubject = await Subject.findOne({
      _id: { $ne: subject._id },
      user: req.user._id,
      name: { $regex: `^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });

    if (existingSubject) {
      return res.status(400).json({ message: 'Esiste gia una materia con questo nome.' });
    }

    subject.name = trimmedName;
    subject.description = buildDefaultDescription(trimmedName);
    subject.color = color;
    subject.scheduleEnabled = scheduleEnabled;
    subject.scheduleDays = scheduleEnabled ? scheduleDays : [];
    subject.startTime = startTime;
    subject.endTime = endTime;

    const updatedSubject = await subject.save();

    return res.status(200).json({
      message: 'Materia aggiornata con successo.',
      subject: sanitizeSubject(updatedSubject)
    });
  } catch (error) {
    next(error);
  }
}

async function deleteSubject(req, res, next) {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!subject) {
      return res.status(404).json({ message: 'Materia non trovata.' });
    }

    return res.status(200).json({
      message: 'Materia eliminata con successo.'
    });
  } catch (error) {
    next(error);
  }
}

export { createSubject, deleteSubject, getSubjects, sanitizeSubject, updateSubject };
