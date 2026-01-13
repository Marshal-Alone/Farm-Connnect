import { getDatabase, collections } from '../config/database.js';
import seedDemoUsers from './seedDemoUsers.js';

async function seedDemoMachinery() {
    try {
        // First, seed users and get their IDs
        console.log('Seeding demo users first...');
        const userIds = await seedDemoUsers();

        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);
        const usersCollection = db.collection(collections.users);

        // Get user details - these are the REAL demo farmers
        const ram = await usersCollection.findOne({ _id: userIds.ram });
        const priya = await usersCollection.findOne({ _id: userIds.priya });
        const harpreet = await usersCollection.findOne({ _id: userIds.harpreet });

        // Clear ALL existing machinery to remove broken entries
        await machineryCollection.deleteMany({});
        console.log('\nCleared ALL existing machinery');

        const demoMachinery = [
            {
                name: 'John Deere 5310 PowerTech Tractor',
                type: 'tractor',
                description: 'Reliable 55 HP tractor perfect for land preparation, hauling, and multi-purpose field work.',
                brand: 'John Deere',
                model: '5310 PowerTech',
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
                    address: 'Farm Road, Ludhiana',
                    city: 'Ludhiana',
                    state: 'Punjab',
                    pincode: '141001',
                    coordinates: { latitude: 30.9010, longitude: 75.8573 }
                },
                specifications: [
                    { key: 'Engine Power', value: '55 HP' },
                    { key: 'Fuel Type', value: 'Diesel' },
                    { key: 'Transmission', value: 'Manual' },
                    { key: 'Weight', value: '2400 kg' }
                ],
                features: ['Power Steering', 'Oil Brakes', 'High Torque'],
                images: ['/assets/john-deere-tractor.jpg'],
                rating: 4.8,
                totalReviews: 24,
                totalBookings: 45,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Mahindra 575 DI XP Plus Utility Tractor',
                type: 'tractor',
                description: 'Durable Mahindra tractor known for efficient performance and low operational cost.',
                brand: 'Mahindra',
                model: '575 DI XP Plus',
                condition: 'excellent',
                ownerId: priya._id.toString(),
                ownerName: priya.name,
                ownerPhone: priya.phone,
                ownerEmail: priya.email,
                pricePerDay: 2000,
                securityDeposit: 4000,
                deliveryAvailable: true,
                deliveryRadius: 40,
                deliveryChargePerKm: 15,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 24 hours before booking',
                location: {
                    address: 'Agricultural Zone, Pune',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411001',
                    coordinates: { latitude: 18.5204, longitude: 73.8567 }
                },
                specifications: [
                    { key: 'Engine Power', value: '47 HP' },
                    { key: 'Fuel Type', value: 'Diesel' },
                    { key: 'Transmission', value: 'Manual' },
                    { key: 'Weight', value: '2100 kg' }
                ],
                features: ['Low Maintenance', 'Fuel Efficient', 'Multi-Speed'],
                images: ['/assets/mahindra-tractor.jpg'],
                rating: 4.6,
                totalReviews: 18,
                totalBookings: 32,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'CLAAS Crop Harvester (Combine)',
                type: 'harvester',
                description: 'Modern combine harvester capable of reaping, threshing, and cleaning grain crops all in one pass. Best for wheat, rice, and barley.',
                brand: 'CLAAS',
                model: 'Crop Harvester',
                condition: 'excellent',
                ownerId: harpreet._id.toString(),
                ownerName: harpreet.name,
                ownerPhone: harpreet.phone,
                ownerEmail: harpreet.email,
                pricePerDay: 5000,
                securityDeposit: 10000,
                deliveryAvailable: true,
                deliveryRadius: 100,
                deliveryChargePerKm: 30,
                minimumBookingHours: 8,
                cancellationPolicy: 'Free cancellation up to 72 hours before booking',
                location: {
                    address: 'Farm House, Amritsar',
                    city: 'Amritsar',
                    state: 'Punjab',
                    pincode: '143001',
                    coordinates: { latitude: 31.6340, longitude: 74.8723 }
                },
                specifications: [
                    { key: 'Engine Power', value: '100+ HP' },
                    { key: 'Cutting Width', value: '4+ meters' },
                    { key: 'Fuel Type', value: 'Diesel' },
                    { key: 'Grain Tank Capacity', value: '1500-2000 L' }
                ],
                features: ['Auto Height Control', 'Grain Loss Monitor', 'GPS Ready'],
                images: ['/assets/claas-harvester.jpg'],
                rating: 4.9,
                totalReviews: 31,
                totalBookings: 58,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Heavy Duty 6-Foot Rotavator',
                type: 'rotavator',
                description: 'Robust rotary tiller for intensive land preparation with high-strength boron steel blades. Ideal for 45+ HP tractors.',
                brand: 'Shaktiman',
                model: 'SRT-6 Heavy Duty',
                condition: 'good',
                ownerId: ram._id.toString(),
                ownerName: ram.name,
                ownerPhone: ram.phone,
                ownerEmail: ram.email,
                pricePerDay: 800,
                securityDeposit: 2000,
                deliveryAvailable: true,
                deliveryRadius: 30,
                deliveryChargePerKm: 10,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 24 hours before booking',
                location: {
                    address: 'Village Road, Jalandhar',
                    city: 'Jalandhar',
                    state: 'Punjab',
                    pincode: '144001',
                    coordinates: { latitude: 31.3260, longitude: 75.5762 }
                },
                specifications: [
                    { key: 'Working Width', value: '6 Feet' },
                    { key: 'Number of Blades', value: '42' },
                    { key: 'Blade Type', value: 'Boron Steel' }
                ],
                features: ['Heavy Duty', 'Multi-Gear', 'High Durability'],
                images: ['/assets/rotavator.jpg'],
                rating: 4.5,
                totalReviews: 15,
                totalBookings: 28,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'DJI Agras T30 Agricultural Spray Drone',
                type: 'sprayer',
                description: 'High-precision agricultural drone for chemical spraying with advanced GPS and obstacle avoidance.',
                brand: 'DJI',
                model: 'Agras T30',
                condition: 'excellent',
                ownerId: priya._id.toString(),
                ownerName: priya.name,
                ownerPhone: priya.phone,
                ownerEmail: priya.email,
                pricePerDay: 3500,
                securityDeposit: 15000,
                deliveryAvailable: false,
                deliveryRadius: 0,
                deliveryChargePerKm: 0,
                minimumBookingHours: 2,
                cancellationPolicy: 'Free cancellation up to 48 hours before booking',
                location: {
                    address: 'Tech Farm, Ahmedabad',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    pincode: '380001',
                    coordinates: { latitude: 23.0225, longitude: 72.5714 }
                },
                specifications: [
                    { key: 'Tank Capacity', value: '30 Liters' },
                    { key: 'Spray Width', value: '9 meters' },
                    { key: 'Flight Time', value: '15 minutes' },
                    { key: 'Coverage', value: '16 acres/hour' }
                ],
                features: ['Auto-Pilot', 'Obstacle Avoidance', 'Precision Spray'],
                images: ['/assets/spray-drone.jpg'],
                rating: 4.7,
                totalReviews: 12,
                totalBookings: 20,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Precision 9-Tyne Seed Drill',
                type: 'seeder',
                description: 'Adjustable seed drill for uniform planting across various crop types with fertilizer attachment capability.',
                brand: 'Landforce',
                model: 'SD-9 Precision Drill',
                condition: 'good',
                ownerId: harpreet._id.toString(),
                ownerName: harpreet.name,
                ownerPhone: harpreet.phone,
                ownerEmail: harpreet.email,
                pricePerDay: 1200,
                securityDeposit: 3000,
                deliveryAvailable: true,
                deliveryRadius: 50,
                deliveryChargePerKm: 15,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 24 hours before booking',
                location: {
                    address: 'Grain Market Road, Karnal',
                    city: 'Karnal',
                    state: 'Haryana',
                    pincode: '132001',
                    coordinates: { latitude: 29.6857, longitude: 76.9905 }
                },
                specifications: [
                    { key: 'Number of Tynes', value: '9' },
                    { key: 'Working Width', value: '1.8 meters' },
                    { key: 'Seed Box Capacity', value: '80 kg' }
                ],
                features: ['Precision Planting', 'Adjustable Depth', 'Fertilizer Attachment'],
                images: ['/assets/seed-drill.jpg'],
                rating: 4.4,
                totalReviews: 9,
                totalBookings: 15,
                available: true,
                isActive: true,
                views: 0,
                bookedDates: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await machineryCollection.insertMany(demoMachinery);
        console.log(`\n✅ Successfully seeded ${result.insertedCount} demo machinery to MongoDB`);
        console.log('\nDemo machinery (linked to demo farmers):');
        demoMachinery.forEach(m => {
            console.log(`  - ${m.name} (${m.type}) - ₹${m.pricePerDay}/day`);
            console.log(`    Owner: ${m.ownerName} | ID: ${m.ownerId} | Email: ${m.ownerEmail}`);
        });

        console.log('\n📋 Ownership Summary:');
        console.log(`  राम शर्मा (ram@farmer.com): 2 machinery (Tractor, Rotavator)`);
        console.log(`  Priya Nair (priya@farmer.com): 2 machinery (Tractor, Drone)`);
        console.log(`  Harpreet Singh (harpreet@farmer.com): 2 machinery (Harvester, Seed Drill)`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding demo machinery:', error);
        process.exit(1);
    }
}

seedDemoMachinery();
