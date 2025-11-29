import { getDatabase, collections } from '../database.js';
import seedDemoUsers from './seedDemoUsers.js';

async function seedDemoMachinery() {
    try {
        // First, seed users and get their IDs
        console.log('Seeding demo users first...');
        const userIds = await seedDemoUsers();

        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);
        const usersCollection = db.collection(collections.users);

        // Get user details
        const ram = await usersCollection.findOne({ _id: userIds.ram });
        const priya = await usersCollection.findOne({ _id: userIds.priya });
        const harpreet = await usersCollection.findOne({ _id: userIds.harpreet });

        // Delete existing demo machinery
        await machineryCollection.deleteMany({
            ownerEmail: { $in: ['ram@farmer.com', 'priya@farmer.com', 'harpreet@farmer.com'] }
        });
        console.log('\nCleared existing demo machinery');

        const demoMachinery = [
            {
                name: 'John Deere 5075E Tractor',
                type: 'tractor',
                description: 'Powerful 75 HP tractor perfect for plowing, tilling, and heavy farm work. Well-maintained and fuel-efficient.',
                brand: 'John Deere',
                model: '5075E',
                condition: 'excellent',
                ownerId: ram._id.toString(),
                ownerName: ram.name,
                ownerPhone: ram.phone,
                ownerEmail: ram.email,
                pricePerDay: 2500,
                securityDeposit: 5000,
                deliveryAvailable: true,
                deliveryRadius: 50,
                deliveryChargePerKm: 20,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 24 hours before booking',
                location: {
                    address: 'Village Road, Nashik',
                    city: 'Nashik',
                    state: 'Maharashtra',
                    pincode: '422001',
                    coordinates: { latitude: 19.9975, longitude: 73.7898 }
                },
                specifications: [
                    { key: 'Engine Power', value: '75 HP' },
                    { key: 'Fuel Type', value: 'Diesel' },
                    { key: 'Transmission', value: 'Manual' },
                    { key: 'Weight', value: '2800 kg' }
                ],
                features: ['Power Steering', '4WD', 'Air Conditioned Cabin', 'Hydraulic Lift'],
                images: ['/demo-images/tractor.png'],
                rating: 4.8,
                totalReviews: 24,
                totalBookings: 45,
                available: true,
                isActive: true,  // Required for API filter
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Traditional Bullock Cart',
                type: 'livestock',
                description: 'Traditional bullock cart with two healthy bullocks. Ideal for transporting crops and farm produce in rural areas.',
                brand: 'Local',
                model: 'Traditional',
                condition: 'good',
                ownerId: priya._id.toString(),
                ownerName: priya.name,
                ownerPhone: priya.phone,
                ownerEmail: priya.email,
                pricePerDay: 800,
                securityDeposit: 2000,
                deliveryAvailable: false,
                deliveryRadius: 0,
                deliveryChargePerKm: 0,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 48 hours before booking',
                location: {
                    address: 'Coconut Farm, Kochi',
                    city: 'Kochi',
                    state: 'Kerala',
                    pincode: '682001',
                    coordinates: { latitude: 9.9312, longitude: 76.2673 }
                },
                specifications: [
                    { key: 'Bullocks', value: '2 Healthy Bullocks' },
                    { key: 'Cart Capacity', value: '500 kg' },
                    { key: 'Cart Type', value: 'Wooden' }
                ],
                features: ['Well-trained Bullocks', 'Strong Wooden Cart', 'Suitable for Rural Roads'],
                images: ['/demo-images/bullock-cart.png'],
                rating: 4.5,
                totalReviews: 18,
                totalBookings: 32,
                available: true,
                isActive: true,  // Required for API filter
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Mahindra Arjun 605 DI Harvester',
                type: 'harvester',
                description: 'Modern combine harvester for wheat, rice, and other grain crops. Saves time and labor during harvest season.',
                brand: 'Mahindra',
                model: 'Arjun 605 DI',
                condition: 'excellent',
                ownerId: harpreet._id.toString(),
                ownerName: harpreet.name,
                ownerPhone: harpreet.phone,
                ownerEmail: harpreet.email,
                pricePerDay: 4500,
                securityDeposit: 10000,
                deliveryAvailable: true,
                deliveryRadius: 100,
                deliveryChargePerKm: 30,
                minimumBookingHours: 8,
                cancellationPolicy: 'Free cancellation up to 72 hours before booking',
                location: {
                    address: 'Farm House, Ludhiana',
                    city: 'Ludhiana',
                    state: 'Punjab',
                    pincode: '141001',
                    coordinates: { latitude: 30.9010, longitude: 75.8573 }
                },
                specifications: [
                    { key: 'Engine Power', value: '60 HP' },
                    { key: 'Cutting Width', value: '3.5 meters' },
                    { key: 'Fuel Type', value: 'Diesel' },
                    { key: 'Grain Tank Capacity', value: '1200 liters' }
                ],
                features: ['Auto Height Control', 'Grain Loss Monitor', 'Comfortable Operator Seat', 'LED Work Lights'],
                images: ['/demo-images/harvester.png'],
                rating: 4.9,
                totalReviews: 31,
                totalBookings: 58,
                available: true,
                isActive: true,  // Required for API filter
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await machineryCollection.insertMany(demoMachinery);
        console.log(`\n✅ Successfully seeded ${result.insertedCount} demo machinery to MongoDB`);
        console.log('\nDemo machinery:');
        demoMachinery.forEach(m => {
            console.log(`  - ${m.name} (${m.type}) - ₹${m.pricePerDay}/day`);
            console.log(`    Owner: ${m.ownerName} (ID: ${m.ownerId})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding demo machinery:', error);
        process.exit(1);
    }
}

seedDemoMachinery();
