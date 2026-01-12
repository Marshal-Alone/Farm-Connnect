import { getDatabase, collections } from '../config/database.js';
import bcrypt from 'bcrypt';

async function seedDemoUsers() {
    try {
        const db = await getDatabase();
        const usersCollection = db.collection(collections.users);

        // Delete existing demo users first
        await usersCollection.deleteMany({
            email: { $in: ['ram@farmer.com', 'priya@farmer.com', 'harpreet@farmer.com'] }
        });
        console.log('Cleared existing demo users');

        // Hash password for demo users
        const hashedPassword = await bcrypt.hash('farmer123', 10);

        const demoUsers = [
            {
                // Let MongoDB generate ObjectId automatically
                name: 'राम शर्मा',
                email: 'ram@farmer.com',
                password: hashedPassword,
                phone: '+91-9876543210',
                location: 'Maharashtra, India',
                language: 'hindi',
                farmSize: 5.5,
                crops: ['rice', 'wheat', 'sugarcane'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Priya Nair',
                email: 'priya@farmer.com',
                password: hashedPassword,
                phone: '+91-9876543211',
                location: 'Kerala, India',
                language: 'malayalam',
                farmSize: 3.2,
                crops: ['coconut', 'pepper', 'cardamom'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Harpreet Singh',
                email: 'harpreet@farmer.com',
                password: hashedPassword,
                phone: '+91-9876543212',
                location: 'Punjab, India',
                language: 'punjabi',
                farmSize: 12.8,
                crops: ['wheat', 'rice', 'cotton'],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await usersCollection.insertMany(demoUsers);
        console.log(`✅ Successfully seeded ${result.insertedCount} demo users to MongoDB with ObjectIds`);

        // Get the inserted users with their ObjectIds
        const insertedUsers = await usersCollection.find({
            email: { $in: ['ram@farmer.com', 'priya@farmer.com', 'harpreet@farmer.com'] }
        }).toArray();

        console.log('\nDemo users with ObjectIds:');
        insertedUsers.forEach(user => {
            console.log(`  - ${user.name} (${user.email})`);
            console.log(`    ID: ${user._id}`);
            console.log(`    Password: farmer123\n`);
        });

        // Return the user IDs for machinery seeding
        return {
            ram: insertedUsers.find(u => u.email === 'ram@farmer.com')._id,
            priya: insertedUsers.find(u => u.email === 'priya@farmer.com')._id,
            harpreet: insertedUsers.find(u => u.email === 'harpreet@farmer.com')._id
        };
    } catch (error) {
        console.error('Error seeding demo users:', error);
        throw error;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDemoUsers()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

export default seedDemoUsers;
