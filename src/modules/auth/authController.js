import authService from './authService.js';
import { authResource } from './authResource.js';

const authController = {
    async register(req, res) {
        try {
            const { email, password, phone } = req.body;

            const user = await authService.create(email, password, phone);
            const accessToken = await authService.generateAccessToken(user);
            const refreshToken = await authService.generateRefreshToken(user);
            await authService.sendWelcomeEmail(user);
            await authService.sendVerificationEmail(user);

            return res.status(201).json(authResource(user, accessToken, refreshToken));
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await authService.validateCredentials(email, password);
            const accessToken = await authService.generateAccessToken(user);
            const refreshToken = await authService.checkRefreshToken(user);

            res.status(200).json(authResource(user, accessToken, refreshToken));
        } catch (err) {
            res.status(400).json({ message: err.message || 'Invalid credentials' });
        }
    },

    async logout(req, res) {
        try {
            await authService.revokeAccessToken(req);

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    },

    async refresh(req, res) {
        try {
            const refreshToken = req.header('X-Refresh-Token');

            const { accessToken, accessExpiry } = await authService.refreshAccessToken(refreshToken);

            res.status(200).json({ accessToken, accessExpiry });
        } catch (err) {
            res.status(400).json({ message: err.message || 'Invalid refresh token' });
        }
    },

    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            
            await authService.verifyEmail(token);
            
            res.send('<h1>Email Verified Successfully</h1>');
        } catch (err) {
            res.status(400).send(`<h1>${err.message}</h1>`);
        }
    },
};

export default authController;
