function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    school: user.school,
    courseOfStudy: user.courseOfStudy,
    language: user.language,
    theme: user.theme,
    weekStart: user.weekStart,
    plannerStartHour: user.plannerStartHour,
    plannerEndHour: user.plannerEndHour,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export default sanitizeUser;
