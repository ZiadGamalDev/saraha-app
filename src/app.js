import express from 'express';
import authRoutes from './modules/auth/authRoutes.js';
import profileRoute from './modules/profile/profileRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/profile', profileRoute);

app.use('/uploads', express.static('uploads'));

app.get('/test', (req, res) => {
    res.send('ok');
});

export default app;
