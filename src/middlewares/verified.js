import User from '../db/models/userModel.js';

const verified = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
    
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default verified;
