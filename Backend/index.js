import dotenv from 'dotenv';

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./backend/.env" });

import express from 'express';
import connectDB from './config/db.js';
import passport from './services/passport.js';
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authrout from './routes/auth.js';
import cors from 'cors';


const app = express();
connectDB();
const port = 5000;

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use(express.json());

app.use('/auth', authrout);


app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
)


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
  console.log(`Server is running at http://localhost:${port}`);
});