import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MDBConnect } from './mongoDB/connectMongoDB.js';
import userRoute from './routes/userRoute.js';
import transactionsRoute from './routes/transactionRoute.js';

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

const PORT = process.env.PORT || 4000;

// Routes
app.get('/health', (req, res) => {
  res.send('Server is running');
});

app.use('/api/user', userRoute);
app.use('/api/transaction', transactionsRoute);

// Connect to Database
MDBConnect();

// Server
app.listen(PORT, console.log(`server running on port ${PORT}`));
