import express from 'express';

import { Server } from 'socket.io';
import  Connection  from './database/db.js';

import userRoutes from './routes/user_routes.js';

import { getDocument, updateDocument } from './controller/document_controller.js';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 9000;
const PORT2 = process.env.PORT2 || 9001;
// const PORT =  9000;
// const PORT2 = 9001;

// Middleware
app.use(express.json());
app.use(cookieParser());

Connection();

// API Routes
app.use('/api/users', userRoutes);

const io = new Server(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

io.on("connection", socket => {

    socket.on("get-document", async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", delta => {
            console.log("connected check", delta);
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        })

        socket.on("save-document", async data => {
            await updateDocument(documentId, data);
        });
    });

});


app.listen(PORT2, () => console.log(`Server is running on port ${PORT2}`));
