import BlacklistToken from '../db/models/blacklistTokenModel.js';

const revokeToken = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        const isBlacklisted = await BlacklistToken.exists({ accessToken });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is already blacklisted' });
        }

        await BlacklistToken.create({ token: accessToken, blacklistedAt: new Date() });

        next();
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

export default revokeToken;
