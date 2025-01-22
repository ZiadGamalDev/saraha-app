import User from '../../db/models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../../utils/crypto.js';
import { sendMail } from '../../utils/mail.js';
import { template } from '../../utils/template.js';

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
            if (process.env.EMAIL_ENABLED === 'y') {
                await sendMail(email, 'Welcome to Saraha App', template('email', 'welcome.html'));
                const emailToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const verifyLink = `${process.env.APP_BASE_URL}/auth/email/verify/${emailToken}`;
                const emailTemplate = template('email', 'verification.html').replace('{{verifyLink}}', verifyLink);
                await sendMail(email, 'Verify your email', emailTemplate);
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ user, token });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        user.password = undefined;
        if (user.phone) {
            user.phone = decrypt(user.phone);
        }

        res.status(200).json({ user, token });
    },

    async logout(req, res) {
        const { token } = req.headers;

        // validate
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || user.expiredTokens.includes(token)) {
                return res.status(400).json({ message: 'Unauthenticated' });
            }

            user.expiredTokens.push(token);
            await user.save();

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (err) {
            res.status(400).json({ message: 'Invalid token' });
        }
    },

    async verifyEmail(req, res) {
        const { token } = req.params;

        try {
            const { email } = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findOne({ email });

            if (!user || user.expiredTokens.includes(token)) {
                return res.send('<h1>Invalid or Expired Token</h1>');
            }

            user.isVerified = true;
            user.expiredTokens.push(token);
            await user.save();

            res.send('<h1>Email Verified Successfully</h1>');
        } catch (err) {
            res.status(400).send('<h1>Invalid or Expired Token</h1>');
        }
    }
};

export default authController;
