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
import path from "path";
import {v2 as cloudinary} from "cloudinary";



dotenv.config();

const app = express();
export  default app;

const _dirname = path.resolve();

app.use(cors({
    origin: "https://library-management-final-x5ae.onrender.com", 
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


console.log('Registering routes...');
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/borrow', borrowRoutes);
app.use('/api/v1/user', userRoutes);
console.log('Routes registered.');

app.use(express.static(path.join(_dirname, "client","dist")));
app.get('*',(_, res) => {
    res.sendFile(path.join(_dirname, "client" , "dist" , "index.html"));
});

notifyUsers();
removeUnverifiedAccounts();

connectDB();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log('Route:', r.route.path);
    }
});

app.use(errorMiddlewares);