import express from 'express';
import authRoutes from './modules/auth/authRoutes.js';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/test', (req, res) => {
    res.send('ok');
});

export default app;
