import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { PORT } from "./config";


dotenv.config();


const app: Application = express();


app.use(express.json());

const corsOptions={
  origin: process.env.NODE_ENV === 'dev'?'http://localhost:5173':'https://admin.firstlist.in',
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});