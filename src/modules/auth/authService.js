import User from '../../db/models/userModel.js';
import RefreshToken from '../../db/models/refreshTokenModel.js';
import BlacklistToken from '../../db/models/blacklistTokenModel.js';
import jwt from 'jsonwebtoken';
import { encrypt, hash, compare } from '../../utils/crypto.js';
import { template } from '../../utils/template.js';
import { sendMail } from '../../utils/mail.js';

const authService = {
    async create(email, password, phone) {
        return User.create({
            email,
            password: await hash(password),
            phone: phone ? encrypt(phone) : null,
        });
    },

    async generateAccessToken(user) {
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
    },

    async generateRefreshToken(user) {
        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRY });

        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return refreshToken;
    },

    async sendWelcomeEmail(user) {
        const emailTemplate = template('email', 'welcome.html');
        await sendMail(user.email, 'Welcome to our platform', emailTemplate);
    },

    async sendVerificationEmail(user) {
        const emailToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EMAIL_EXPIRY });
        const verifyLink = `${process.env.APP_BASE_URL}/auth/verify/${emailToken}`;
        const emailTemplate = template('email', 'verification.html').replace('{{verifyLink}}', verifyLink);
        await sendMail(user.email, 'Verify your email', emailTemplate);
    },

    async validateCredentials(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }
        return user;
    },

    async checkRefreshToken(user) {
        let refreshToken = await RefreshToken.findOne({ userId: user._id });
        return (!refreshToken || new Date(refreshToken.expiresAt) < new Date()) 
            ? await this.generateRefreshToken(user)
            : refreshToken.token;
    },

    async revokeAccessToken(req) {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            throw new Error('Access token is required');
        }

        const isBlacklisted = await BlacklistToken.exists({ token: accessToken });
        if (isBlacklisted) {
            throw new Error('Token is already blacklisted');
        }

        await BlacklistToken.create({ token: accessToken, blacklistedAt: new Date() });
    },

    async refreshAccessToken(refreshToken) {
        const storedToken = await RefreshToken.findOne({ token: refreshToken });

        if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
            throw new Error('Invalid refresh token');
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
        const accessExpiry = Math.round((jwt.decode(accessToken).exp - Date.now() / 1000) / 60);

        return { accessToken, accessExpiry };
    },

    async verifyEmail(token) {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isVerified) {
            throw new Error('Email is already verified');
        }

        user.isVerified = true;
        await user.save();
        return user;
    },
};

export default authService;
