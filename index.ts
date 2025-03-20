import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { loadConfig } from "./src/config/config";
import router from "./src/routes/routes";
import { initDB } from "./src/config/initDB";
import errorHandler from "./src/middlewares/errorHandler";
import { initPassport } from "./src/services/passport-jwt";
import passport from "passport";
import { IUser } from "./src/interfaces/user";
import cookieParser from 'cookie-parser';

// Load configuration
import * as dotenv from 'dotenv';
dotenv.config();
loadConfig();
// Declare global types for Express
declare global {
    namespace Express {
      interface User extends Omit<IUser, "password"> {}
      interface Request {
        user?: User;
      }
    }
}



initDB();
initPassport();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(passport.initialize());
app.use(cookieParser());
// app.use(cors());  
app.use(cors({
  origin: ['http://localhost:8000', 'https://prisaga-hiring-plus.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome Boss!!");
});

app.use("/api", router);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
