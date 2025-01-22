import jwt from 'jsonwebtoken';
import BlacklistToken from '../db/models/blacklistTokenModel.js';

const authenticate = async (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({ message: 'Access Token is required' });
    }

    try {
        const isBlacklisted = await BlacklistToken.exists({ token: accessToken });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Access Token is blacklisted' });
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Access Token' });
    }
};

export default authenticate;
