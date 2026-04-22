import sanitizeUser from '../utils/sanitizeUser.js';

async function getCurrentUser(req, res) {
  return res.status(200).json({
    user: sanitizeUser(req.user)
  });
}

async function updateCurrentUser(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      school,
      courseOfStudy,
      language,
      weekStart,
      plannerStartHour,
      plannerEndHour
    } = req.body;
    const normalizedFirstName = firstName?.trim() || '';
    const normalizedLastName = lastName?.trim() || '';

    if (!normalizedFirstName || !normalizedLastName) {
      return res.status(400).json({
        message: 'Nome e cognome sono obbligatori.'
      });
    }

    req.user.firstName = normalizedFirstName;
    req.user.lastName = normalizedLastName;
    req.user.school = school?.trim() || '';
    req.user.courseOfStudy = courseOfStudy?.trim() || '';
    req.user.language = language || 'it';
    req.user.weekStart = weekStart || 'monday';
    req.user.plannerStartHour = plannerStartHour || '06:00';
    req.user.plannerEndHour = plannerEndHour || '22:00';

    const updatedUser = await req.user.save();

    return res.status(200).json({
      message: 'Impostazioni aggiornate con successo.',
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    next(error);
  }
}

export { getCurrentUser, updateCurrentUser };
