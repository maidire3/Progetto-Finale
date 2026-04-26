const PASSWORD_REQUIREMENTS = [
  {
    key: 'minLength',
    label: 'almeno 6 caratteri',
    test: (password) => password.length >= 6
  },
  {
    key: 'uppercase',
    label: 'almeno una maiuscola',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    key: 'numbers',
    label: 'almeno 2 numeri',
    test: (password) => (password.match(/\d/g) || []).length >= 2
  }
];

function getPasswordValidationState(password = '') {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    ...requirement,
    isValid: requirement.test(password)
  }));
}

function buildPasswordErrorMessage(password = '') {
  const failedRequirements = getPasswordValidationState(password)
    .filter((requirement) => !requirement.isValid)
    .map((requirement) => requirement.label);

  if (failedRequirements.length === 0) {
    return '';
  }

  if (failedRequirements.length === 1) {
    return `La password deve contenere ${failedRequirements[0]}.`;
  }

  const lastRequirement = failedRequirements[failedRequirements.length - 1];
  const leadingRequirements = failedRequirements.slice(0, -1).join(', ');

  return `La password deve contenere ${leadingRequirements} e ${lastRequirement}.`;
}

function isPasswordValid(password = '') {
  return getPasswordValidationState(password).every((requirement) => requirement.isValid);
}

export {
  PASSWORD_REQUIREMENTS,
  buildPasswordErrorMessage,
  getPasswordValidationState,
  isPasswordValid
};
