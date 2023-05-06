import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import findConfig from 'find-config';
dotenv.config({
    path: findConfig('.env')
});

import UserRoute from './routes/user.js';
import ProjectRoute from './routes/project.js';
import NotificationRouter from './routes/notifications.js';

import { connect } from './db/connection.js';


const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

connect();

//Routes
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/project', ProjectRoute);
app.use('/api/v1/notification', NotificationRouter);

//Server
app.listen(PORT || 6700, () => console.log(`Server running at port => ${PORT}`))