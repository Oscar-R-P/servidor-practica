import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/users.js';

const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

// app.use('/users', userRouter({userModel}));
app.use('/users', userRouter());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});