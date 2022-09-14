import dotenv from 'dotenv'
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouters.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use(authRouter);

app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`))