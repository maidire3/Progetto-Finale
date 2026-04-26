const PASSWORD_RULES = [
  {
    label: 'almeno 6 caratteri',
    test: (password) => password.length >= 6
  },
  {
    label: 'almeno una maiuscola',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'almeno 2 numeri',
    test: (password) => (password.match(/\d/g) || []).length >= 2
  }
];

function getFailedPasswordRequirements(password = '') {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);
}

function buildPasswordValidationMessage(password = '') {
  const failedRequirements = getFailedPasswordRequirements(password);

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
  return getFailedPasswordRequirements(password).length === 0;
}

export { buildPasswordValidationMessage, getFailedPasswordRequirements, isPasswordValid };
