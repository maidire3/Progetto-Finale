import rateLimit from 'express-rate-limit';

const AUTH_WINDOW_MS = 15 * 60 * 1000;

const authLimiterOptions = {
  windowMs: AUTH_WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Troppi tentativi in poco tempo. Riprova tra qualche minuto.'
  }
};

const loginRateLimiter = rateLimit({
  ...authLimiterOptions,
  max: 10
});

const registerRateLimiter = rateLimit({
  ...authLimiterOptions,
  max: 5
});

export { loginRateLimiter, registerRateLimiter };
