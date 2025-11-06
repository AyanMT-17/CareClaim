import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import passport from './services/passport.js';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authrout from './routes/auth.js';
import cors from 'cors';
import policiesRouter from './routes/policies.js';
// routes/claim.js is the actual file present (singular). Use that path so ESM import resolves.
import claimRouter from './routes/claim.js';


dotenv.config();

const app = express();
connectDB();
const port = 5000;

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: ["https://care-claim-or49.vercel.app", "http://localhost:5173", process.env.Frontend_URL], // Hardcoded origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Routes
app.use('/auth', authrout);
app.use('/api/policies', policiesRouter);
app.use('/api/claims', claimRouter); // Add claims routes


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
