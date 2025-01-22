import User from '../../db/models/userModel.js';
import file from '../../utils/file.js';

const authController = {
    async show(req, res) {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    },

    async update(req, res) {
        const user = await User.findById(req.userId);
        const { name, phone } = req.body;
        let image;

        if (req.file) {
            image = file.store(req.file, 'images/user');
            if (user.image) {
                file.delete(user.image);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, image },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    }
};

export default authController;
