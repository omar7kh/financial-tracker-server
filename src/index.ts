import express, { Request, Response } from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MDBConnect } from './mongoDB/connectMongoDB';
import userRoute from './routes/userRoute';
import transactionsRoute from './routes/transactionRoute';

const PORT = 4000;
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.use('/api/user', userRoute);
app.use('/api/transaction', transactionsRoute);

// Connect to Database
MDBConnect();

// Server
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
