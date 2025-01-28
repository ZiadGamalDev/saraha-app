import connectDB from '../connection.js';
import userSeeder from './userSeeder.js';

const seedDatabase = async () => {
    try {
        await connectDB();

        // Run Seeders: node src/db/seeders/dbSeeder.js
        await userSeeder();

        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Database seeding error:', err.message);
        process.exit(1);
    }
};

seedDatabase();