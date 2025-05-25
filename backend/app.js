import express from 'express';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import cors from 'cors';
import {errorMiddlewares} from './middlewares/errorMiddlewares.js';
import connectDB  from './database/db.js';   
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';      
import bookRoutes from './routes/bookRoutes.js';      
import borrowRoutes from './routes/borrowRoutes.js';      
import fileUpload from "express-fileupload";
import { notifyUsers } from './services/notifyUsers.js';
import { removeUnverifiedAccounts } from './services/removeUnverifiedAcccounts.js';


dotenv.config();

const app = express();
export  default app;

app.use(cors({
    origin: process.env.FRONTEND_URL,  //frontend url
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/borrow', borrowRoutes);
app.use('/api/v1/user', userRoutes);

notifyUsers();
removeUnverifiedAccounts();

connectDB();

app.use(errorMiddlewares);