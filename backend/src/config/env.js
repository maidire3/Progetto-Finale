function validateEnv() {
  const requiredVariables = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
  const missingVariables = requiredVariables.filter(
    (variableName) => !process.env[variableName]?.trim()
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Variabili ambiente mancanti: ${missingVariables.join(', ')}. Controlla il file .env.`
    );
  }
}

export default validateEnv;
