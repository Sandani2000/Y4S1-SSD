import jwt from "jsonwebtoken";
import User from "../schemas/user.schema.js";
import { config } from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

config();

const generateToken = (res, userId, role) => {
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId, role }, jwtSecret, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  });

  return token;
};

const clearToken = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = generateToken(res, user._id, user.role);
    res.send({ token, role: user.role, user_id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, NIC, role } = req.body;
    const user = new User({ name, email, password, NIC, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "learner",
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google OAuth callback
const googleAuthCallback = async (req, res) => {
  try {
    // Check if the user exists in the request object from Passport
    if (!req.user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate JWT token
    const token = generateToken(res, req.user._id, req.user.role);

    res.redirect(`http://localhost:3000/auth/redirect?token=${token}&role=${req.user.role}&userId=${req.user._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { login, register, googleAuthCallback };
