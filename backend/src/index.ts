import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT } from "./config";
import userRouter from "./routes/user";
import presentationRouter from "./routes/presentation";
import imageRouter from "./routes/image";


dotenv.config();


const app: Application = express();


app.use(express.json());

const corsOptions={
  origin: process.env.NODE_ENV === 'dev'?'http://localhost:3000':'https://encorp.rudrasankha.com',
  method:['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-VERIFY', 'X-MERCHANT-ID'],
  credentials:true
}

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", (req: Request, res: Response) => {
  res.json({});
});

app.use("/api/v1/user",userRouter);
app.use("/api/v1/presentation",presentationRouter);
app.use("/api/v1/image", imageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});