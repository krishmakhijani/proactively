import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import speakerRoutes from './routes/speakerRoutes';
import speakerListingRoutes from './routes/speakerListingRoutes';
import bookingRoutes from './routes/bookingRoutes'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/speakers', speakerListingRoutes);
app.use('/api/booking',bookingRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
