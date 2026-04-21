import Task from '../models/Task.js';

function sanitizeTask(task) {
  return {
    id: task._id,
    title: task.title,
    subject: task.subject,
    status: task.status,
    notes: task.notes,
    dueDate: task.dueDate,
    startHour: Number.isFinite(task.startHour) ? task.startHour : null,
    endHour: Number.isFinite(task.endHour) ? task.endHour : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: 1 });

    return res.status(200).json({
      tasks: tasks.map(sanitizeTask)
    });
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const {
      title,
      subject,
      status = 'Da fare',
      notes = '',
      dueDate = '',
      startHour = null,
      endHour = null
    } = req.body;

    const trimmedTitle = title?.trim();
    const trimmedSubject = subject?.trim();

    if (!trimmedTitle || !trimmedSubject) {
      return res.status(400).json({
        message: 'Titolo e materia sono obbligatori.'
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: trimmedTitle,
      subject: trimmedSubject,
      status,
      notes: notes?.trim() || '',
      dueDate: dueDate?.trim() || '',
      startHour: Number.isFinite(startHour) ? startHour : null,
      endHour: Number.isFinite(endHour) ? endHour : null
    });

    return res.status(201).json({
      message: 'Task creata con successo.',
      task: sanitizeTask(task)
    });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const {
      title,
      subject,
      status = 'Da fare',
      notes = '',
      dueDate = '',
      startHour = null,
      endHour = null
    } = req.body;

    const trimmedTitle = title?.trim();
    const trimmedSubject = subject?.trim();

    if (!trimmedTitle || !trimmedSubject) {
      return res.status(400).json({
        message: 'Titolo e materia sono obbligatori.'
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task non trovata.' });
    }

    task.title = trimmedTitle;
    task.subject = trimmedSubject;
    task.status = status;
    task.notes = notes?.trim() || '';
    task.dueDate = dueDate?.trim() || '';
    task.startHour = Number.isFinite(startHour) ? startHour : null;
    task.endHour = Number.isFinite(endHour) ? endHour : null;

    const updatedTask = await task.save();

    return res.status(200).json({
      message: 'Task aggiornata con successo.',
      task: sanitizeTask(updatedTask)
    });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task non trovata.' });
    }

    return res.status(200).json({
      message: 'Task eliminata con successo.'
    });
  } catch (error) {
    next(error);
  }
}

export { createTask, deleteTask, getTasks, sanitizeTask, updateTask };
