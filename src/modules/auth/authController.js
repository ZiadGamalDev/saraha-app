import User from '../../db/models/userModel.js';
import bcrypt from 'bcrypt';
import { encrypt, decrypt } from '../../utils/crypto.js';
import { sendMail } from '../../utils/mail.js';

const authController = {
    async register(req, res) {
        let { email, password, confirmedPassword, phone } = req.body;

        // validate
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (password !== confirmedPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (phone) {
            if (await User.findOne({ phone })) {
                return res.status(400).json({ message: 'Phone number already exists' });
            }
            phone = encrypt(phone);
        }

        // hash password
        const saltRounds = parseInt(process.env.SALT_ROUNDS);
        password = await bcrypt.hash(password, saltRounds);

        try {
            const user = await User.create({ email, password, phone });

            user.password = undefined;
            if (user.phone) {
                user.phone = decrypt(user.phone);
            }

            // Send welcome email
            await sendMail(user.email, 'Welcome to Saraha App', 'Thank you for registering!');
            
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        // validate
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Email does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        user.password = undefined;
        if (user.phone) {
            user.phone = decrypt(user.phone);
        }
        
        res.status(200).json(user);
    },
};

export default authController;