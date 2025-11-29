// Test script to populate sample machinery data
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://trylaptop2024:trylaptop2024@cluster0.q8qtgtu.mongodb.net/?appName=Cluster0";

const sampleMachinery = [
    {
        name: 'John Deere 5075E Tractor',
        type: 'tractor',
        ownerId: 'user123',
        ownerName: 'Rajesh Kumar',
        ownerPhone: '+91 9876543210',
        ownerEmail: 'rajesh@example.com',
        location: {
            address: 'Village Road, Sector 12',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411001',
            coordinates: {
                latitude: 18.5204,
                longitude: 73.8567
            }
        },
        pricePerDay: 2500,
        pricePerHour: 350,
        rating: 4.8,
        totalReviews: 24,
        available: true,
        images: [
            'https://agri-buddy-chi.vercel.app/assets/green-tractor-WU5CtJez.jpg'
        ],
        description: '75 HP tractor perfect for medium to large farms. Well-maintained and regularly serviced.',
        specifications: [
            { key: 'Engine Power', value: '75 HP' },
            { key: 'Drive Type', value: '4WD' },
            { key: 'Transmission', value: 'Power Steering' },
            { key: 'Fuel Type', value: 'Diesel' }
        ],
        features: ['75HP Engine', '4WD', 'Power Steering', 'Front Loader'],
        condition: 'excellent',
        yearOfManufacture: 2020,
        brand: 'John Deere',
        model: '5075E',
        bookedDates: [],
        deliveryAvailable: true,
        deliveryRadius: 50,
        deliveryChargePerKm: 20,
        minimumBookingHours: 4,
        securityDeposit: 5000,
        cancellationPolicy: 'Free cancellation up to 24 hours before booking',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        views: 0,
        totalBookings: 0
    },
    {
        name: 'Mahindra Arjun 605 DI Tractor',
        type: 'tractor',
        ownerId: 'user456',
        ownerName: 'Suresh Patel',
        ownerPhone: '+91 9876543211',
        ownerEmail: 'suresh@example.com',
        location: {
            address: 'Farm House, NH 48',
            city: 'Nashik',
            state: 'Maharashtra',
            pincode: '422001',
            coordinates: {
                latitude: 19.9975,
                longitude: 73.7898
            }
        },
        pricePerDay: 2200,
        pricePerHour: 300,
        rating: 4.6,
        totalReviews: 18,
        available: true,
        images: [
            'https://agri-buddy-chi.vercel.app/assets/green-tractor-WU5CtJez.jpg'
        ],
        description: '60 HP Mahindra tractor with excellent fuel efficiency. Ideal for all farming operations.',
        specifications: [
            { key: 'Engine Power', value: '60 HP' },
            { key: 'Drive Type', value: '2WD' },
            { key: 'Cylinders', value: '4 Cylinder' },
            { key: 'Fuel Type', value: 'Diesel' }
        ],
        features: ['60HP Engine', 'Fuel Efficient', 'Easy Operation', 'Reliable'],
        condition: 'good',
        yearOfManufacture: 2019,
        brand: 'Mahindra',
        model: 'Arjun 605 DI',
        bookedDates: [],
        deliveryAvailable: true,
        deliveryRadius: 30,
        deliveryChargePerKm: 15,
        minimumBookingHours: 4,
        securityDeposit: 4000,
        cancellationPolicy: 'Free cancellation up to 24 hours before booking',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        views: 0,
        totalBookings: 0
    },
    {
        name: 'Kubota Rotavator',
        type: 'rotavator',
        ownerId: 'user789',
        ownerName: 'Amit Singh',
        ownerPhone: '+91 9876543212',
        ownerEmail: 'amit@example.com',
        location: {
            address: 'Agricultural Zone',
            city: 'Solapur',
            state: 'Maharashtra',
            pincode: '413001',
            coordinates: {
                latitude: 17.6599,
                longitude: 75.9064
            }
        },
        pricePerDay: 1800,
        pricePerHour: 250,
        rating: 4.7,
        totalReviews: 15,
        available: true,
        images: [
            'https://agri-buddy-chi.vercel.app/assets/irrigation-pipes-DoYSmP0f.jpg'
        ],
        description: 'Heavy-duty rotavator for soil preparation. Wide cutting width for faster operation.',
        specifications: [
            { key: 'Cutting Width', value: '6 feet' },
            { key: 'Blades', value: '36 Blades' },
            { key: 'Depth', value: 'Adjustable up to 8 inches' },
            { key: 'Weight', value: '450 kg' }
        ],
        features: ['Wide Cutting', 'Adjustable Depth', 'Easy Operation', 'Durable'],
        condition: 'good',
        yearOfManufacture: 2021,
        brand: 'Kubota',
        model: 'RT-180',
        bookedDates: [],
        deliveryAvailable: true,
        deliveryRadius: 25,
        deliveryChargePerKm: 18,
        minimumBookingHours: 3,
        securityDeposit: 3000,
        cancellationPolicy: 'Free cancellation up to 12 hours before booking',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        views: 0,
        totalBookings: 0
    },
    {
        name: 'Drip Irrigation System',
        type: 'irrigation',
        ownerId: 'user101',
        ownerName: 'Priya Nair',
        ownerPhone: '+91 9876543213',
        ownerEmail: 'priya@example.com',
        location: {
            address: 'Agro Park',
            city: 'Kochi',
            state: 'Kerala',
            pincode: '682001',
            coordinates: {
                latitude: 9.9312,
                longitude: 76.2673
            }
        },
        pricePerDay: 800,
        rating: 4.5,
        totalReviews: 12,
        available: true,
        images: [
            'https://agri-buddy-chi.vercel.app/assets/irrigation-pipes-DoYSmP0f.jpg'
        ],
        description: 'Complete drip irrigation system with 500m pipes, drippers, and connectors. Perfect for water conservation.',
        specifications: [
            { key: 'Pipe Length', value: '500 meters' },
            { key: 'Dripper Spacing', value: '30 cm' },
            { key: 'Flow Rate', value: '4 LPH' },
            { key: 'Coverage', value: '1 acre' }
        ],
        features: ['500m Pipes', 'Drip System', 'Water Efficient', 'Easy Setup'],
        condition: 'excellent',
        yearOfManufacture: 2022,
        brand: 'Jain Irrigation',
        model: 'Premium Drip Kit',
        bookedDates: [],
        deliveryAvailable: true,
        deliveryRadius: 40,
        deliveryChargePerKm: 10,
        minimumBookingHours: 8,
        securityDeposit: 2000,
        cancellationPolicy: 'Free cancellation up to 48 hours before booking',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        views: 0,
        totalBookings: 0
    },
    {
        name: 'Working Bullocks Pair',
        type: 'livestock',
        ownerId: 'user202',
        ownerName: 'किसान भाई',
        ownerPhone: '+91 9876543214',
        ownerEmail: 'kisan@example.com',
        location: {
            address: 'Village Center',
            city: 'Satara',
            state: 'Maharashtra',
            pincode: '415001',
            coordinates: {
                latitude: 17.6805,
                longitude: 74.0183
            }
        },
        pricePerDay: 1200,
        rating: 4.9,
        totalReviews: 28,
        available: true,
        images: [
            'https://agri-buddy-chi.vercel.app/assets/bullocks-BRC40xSB.jpg'
        ],
        description: 'Strong and healthy pair of trained bullocks. Excellent for traditional farming and plowing.',
        specifications: [
            { key: 'Age', value: '5-6 years' },
            { key: 'Training', value: 'Fully Trained' },
            { key: 'Health', value: 'Excellent' },
            { key: 'Experience', value: '3+ years' }
        ],
        features: ['Trained Bulls', 'Healthy', 'Experienced', 'Traditional Farming'],
        condition: 'excellent',
        bookedDates: [],
        deliveryAvailable: false,
        minimumBookingHours: 8,
        securityDeposit: 1500,
        cancellationPolicy: 'Free cancellation up to 24 hours before booking',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        views: 0,
        totalBookings: 0
    }
];

async function populateData() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('FarmConnect');
        const machineryCollection = db.collection('machinery');

        // Clear existing data
        await machineryCollection.deleteMany({});
        console.log('🗑️  Cleared existing machinery data');

        // Insert sample data
        const result = await machineryCollection.insertMany(sampleMachinery);
        console.log(`✅ Inserted ${result.insertedCount} machinery items`);

        // Verify insertion
        const count = await machineryCollection.countDocuments();
        console.log(`📊 Total machinery in database: ${count}`);

        console.log('\n🎉 Sample data populated successfully!');
        console.log('\nYou can now test the API at:');
        console.log('- GET http://localhost:4173/api/machinery');
        console.log('- GET http://localhost:4173/api/health');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('\n👋 Database connection closed');
    }
}

populateData();
