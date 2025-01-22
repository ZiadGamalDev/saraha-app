import User from '../../db/models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../../utils/crypto.js';
import { sendMail } from '../../utils/mail.js';
import { template } from '../../utils/template.js';
import RefreshToken from '../../db/models/refreshTokenModel.js';

const authController = {
    async register(req, res) {
        let { email, password, phone } = req.body;

        // hash password and encrypt phone number
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        password = await bcrypt.hash(password, saltRounds);
        if (phone) {
            phone = encrypt(phone);
        }

        try {
            const user = await User.create({ email, password, phone, isVerified: false });

            user.password = undefined;
            if (user.phone) {
                user.phone = decrypt(user.phone);
            }

            // Send welcome and verification email
            if (process.env.EMAIL_ENABLED === 'yes') {
                await sendMail(email, 'Welcome to Saraha App', template('email', 'welcome.html'));
                const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const verifyLink = `${process.env.APP_BASE_URL}/auth/email/verify/${emailToken}`;
                const emailTemplate = template('email', 'verification.html').replace('{{verifyLink}}', verifyLink);
                await sendMail(email, 'Verify your email', emailTemplate);
            }

            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            await RefreshToken.create({
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            res.status(201).json({ user, accessToken, refreshToken });
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email to login' });
        }

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        let refreshToken = await RefreshToken.findOne({ userId: user._id });
        if (!refreshToken || new Date(refreshToken.expiresAt) < new Date()) {
            refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await RefreshToken.create({
                userId: user._id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
        } else {
            refreshToken = refreshToken.token;
        }

        user.password = undefined;
        if (user.phone) {
            user.phone = decrypt(user.phone);
        }

        res.status(200).json({ user, accessToken, refreshToken });
    },

    async logout(req, res) {
        res.status(200).json({ message: 'Logged out successfully' });
    },

    async refresh(req, res) {
        const refreshToken = req.header('X-Refresh-Token');

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        try {
            const storedToken = await RefreshToken.findOne({ token: refreshToken });
            if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
                return res.status(400).json({ message: 'Invalid refresh token' });
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

            res.status(200).json({ accessToken });
        } catch (err) {
            res.status(400).json({ message: 'Invalid refresh token' });
        }
    },

    async verifyEmail(req, res) {
        const { token } = req.params;

        try {
            const { email } = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).send(template('errors', '404.html'));
            }

            if (user.isVerified) {
                return res.status(400).send('<h1>Email is already verified</h1>');
            }

            user.isVerified = true;
            await user.save();

            res.send('<h1>Email Verified Successfully</h1>');
        } catch (err) {
            res.status(400).send('<h1>Invalid or Expired Token</h1>');
        }
    }
};

export default authController;
