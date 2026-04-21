import bcrypt from 'bcrypt';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sanitizeUser from '../utils/sanitizeUser.js';

async function registerUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'firstName, lastName, email e password sono obbligatori.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: 'Esiste gia un account con questa email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'Utente registrato con successo.',
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password sono obbligatorie.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    return res.status(200).json({
      message: 'Login effettuato con successo.',
      token: generateToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export { registerUser, loginUser, sanitizeUser };
