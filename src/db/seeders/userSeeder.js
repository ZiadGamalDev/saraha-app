import User from '../models/userModel.js';
import { encrypt, hash } from '../../utils/crypto.js';

const users = [
    {
        name: 'Admin Test',
        email: 'admintest@example.com',
        password: await hash('password'),
        role: 'admin',
        phone: encrypt('1234567890'),
        isVerified: true,
    },
    {
        name: 'User Test',
        email: 'usertest@example.com',
        password: await hash('password'),
        role: 'user',
        phone: encrypt('1234567891'),
        isVerified: true,
    },
];

const userSeeder = async () => {
    try {
        await User.deleteMany({});
        await User.insertMany(users);

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Users seeding error:', error);
    }
};

export default userSeeder;