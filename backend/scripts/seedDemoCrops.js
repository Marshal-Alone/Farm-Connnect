/**
 * Seed Demo Crops - Add sample crops to all existing users
 * Usage: node scripts/seedDemoCrops.js
 */

import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farm-connect';

// Sample crops with detailed health data for AI insights
const CROPS_BY_REGION = {
  maharashtra: [ // राम शर्मा
    {
      cropName: 'Rice',
      variety: 'Nagpur Orange Rice',
      plantingDate: new Date('2025-06-01'),
      sowDate: new Date('2025-06-01'),
      expectedHarvestDate: new Date('2025-09-15'),
      areaSize: 2.0,
      areaUnit: 'acres',
      status: 'growing',
      growthStage: 'flowering',
      healthStatus: 'good',
      lifecycle: 100,
      cropType: 'cereal',
      variety_group: 'kharif',
      expectedYield: 45,
      yieldUnit: 'quintals',
      soilType: 'clay',
      lastFertilizerDate: new Date('2025-08-01'),
      lastSprayDate: new Date('2025-08-10'),
      pestHistory: ['brown_plant_hopper'],
      diseaseHistory: [],
      notes: 'Good monsoon rains, flowering stage progressing well'
    },
    {
      cropName: 'Wheat',
      variety: 'HD 2967',
      plantingDate: new Date('2025-10-15'),
      sowDate: new Date('2025-10-15'),
      expectedHarvestDate: new Date('2026-03-30'),
      areaSize: 1.8,
      areaUnit: 'acres',
      status: 'growing',
      growthStage: 'heading',
      healthStatus: 'good',
      lifecycle: 120,
      cropType: 'cereal',
      variety_group: 'rabi',
      expectedYield: 42,
      yieldUnit: 'quintals',
      soilType: 'loamy',
      lastFertilizerDate: new Date('2026-01-10'),
      lastSprayDate: new Date('2026-01-15'),
      pestHistory: [],
      diseaseHistory: [],
      notes: 'Winter rabi season, good tiller formation'
    },
    {
      cropName: 'Sugarcane',
      variety: 'CoS 95422',
      plantingDate: new Date('2024-11-01'),
      sowDate: new Date('2024-11-01'),
      expectedHarvestDate: new Date('2026-02-28'),
      areaSize: 1.7,
      areaUnit: 'acres',
      status: 'mature',
      growthStage: 'mature',
      healthStatus: 'fair',
      lifecycle: 365,
      cropType: 'cash',
      variety_group: 'plantation',
      expectedYield: 65,
      yieldUnit: 'tonnes',
      soilType: 'clay-loam',
      lastFertilizerDate: new Date('2025-12-15'),
      lastSprayDate: new Date('2026-01-20'),
      pestHistory: ['shoot_borer', 'root_grub'],
      diseaseHistory: ['leaf_scorch'],
      notes: 'Ready for harvest, monitoring for root rot'
    }
  ],
  kerala: [ // Priya Nair
    {
      cropName: 'Coconut',
      variety: 'Tall Coconut',
      plantingDate: new Date('2018-03-10'),
      sowDate: new Date('2018-03-10'),
      expectedHarvestDate: new Date('2026-06-01'),
      areaSize: 1.5,
      areaUnit: 'acres',
      status: 'mature',
      growthStage: 'bearing',
      healthStatus: 'good',
      lifecycle: 365,
      cropType: 'plantation',
      variety_group: 'perennial',
      expectedYield: 80,
      yieldUnit: 'nuts',
      soilType: 'sandy-loam',
      lastFertilizerDate: new Date('2025-11-20'),
      lastSprayDate: new Date('2025-12-01'),
      pestHistory: ['coconut_mite', 'rhinoceros_beetle'],
      diseaseHistory: ['root_wilt'],
      notes: 'Consistent bearing, implementing integrated pest management'
    },
    {
      cropName: 'Pepper',
      variety: 'Malabar Pepper',
      plantingDate: new Date('2024-04-01'),
      sowDate: new Date('2024-04-01'),
      expectedHarvestDate: new Date('2026-01-30'),
      areaSize: 0.8,
      areaUnit: 'acres',
      status: 'fruiting',
      growthStage: 'flowering',
      healthStatus: 'good',
      lifecycle: 365,
      cropType: 'spice',
      variety_group: 'perennial',
      expectedYield: 2.0,
      yieldUnit: 'tonnes',
      soilType: 'loamy',
      lastFertilizerDate: new Date('2025-08-05'),
      lastSprayDate: new Date('2025-09-10'),
      pestHistory: ['thrips', 'scale_insect'],
      diseaseHistory: ['pollu', 'foot_rot'],
      notes: 'Good flowering observed, high market demand'
    },
    {
      cropName: 'Cardamom',
      variety: 'Malabar Green Cardamom',
      plantingDate: new Date('2019-07-15'),
      sowDate: new Date('2019-07-15'),
      expectedHarvestDate: new Date('2026-02-15'),
      areaSize: 0.9,
      areaUnit: 'acres',
      status: 'bearing',
      growthStage: 'fruiting',
      healthStatus: 'fair',
      lifecycle: 365,
      cropType: 'spice',
      variety_group: 'perennial',
      expectedYield: 1.2,
      yieldUnit: 'tonnes',
      soilType: 'clay-loam',
      lastFertilizerDate: new Date('2025-10-01'),
      lastSprayDate: new Date('2025-11-05'),
      pestHistory: ['shootfly', 'leaf_roller'],
      diseaseHistory: ['leaf_spot', 'rhizome_rot'],
      notes: 'Leaf spot management ongoing, good pod set'
    }
  ],
  punjab: [ // Harpreet Singh
    {
      cropName: 'Wheat',
      variety: 'PBW 343',
      plantingDate: new Date('2025-10-20'),
      sowDate: new Date('2025-10-20'),
      expectedHarvestDate: new Date('2026-03-25'),
      areaSize: 5.2,
      areaUnit: 'acres',
      status: 'growing',
      growthStage: 'grain-filling',
      healthStatus: 'excellent',
      lifecycle: 120,
      cropType: 'cereal',
      variety_group: 'rabi',
      expectedYield: 58,
      yieldUnit: 'quintals',
      soilType: 'loam',
      lastFertilizerDate: new Date('2026-01-15'),
      lastSprayDate: new Date('2026-01-25'),
      pestHistory: [],
      diseaseHistory: [],
      notes: 'Premium quality crop, excellent grain filling stage'
    },
    {
      cropName: 'Rice',
      variety: 'Pusa 1121',
      plantingDate: new Date('2025-05-25'),
      sowDate: new Date('2025-05-25'),
      expectedHarvestDate: new Date('2025-09-10'),
      areaSize: 4.0,
      areaUnit: 'acres',
      status: 'mature',
      growthStage: 'ripening',
      healthStatus: 'good',
      lifecycle: 110,
      cropType: 'cereal',
      variety_group: 'kharif',
      expectedYield: 50,
      yieldUnit: 'quintals',
      soilType: 'clay',
      lastFertilizerDate: new Date('2025-08-10'),
      lastSprayDate: new Date('2025-08-20'),
      pestHistory: ['stem_borer'],
      diseaseHistory: ['blast'],
      notes: 'Premium basmati variety, good kernel length and aroma'
    },
    {
      cropName: 'Cotton',
      variety: 'Bt Cotton - Mahyco 6303',
      plantingDate: new Date('2025-04-15'),
      sowDate: new Date('2025-04-15'),
      expectedHarvestDate: new Date('2025-10-30'),
      areaSize: 3.6,
      areaUnit: 'acres',
      status: 'fruiting',
      growthStage: 'boll-opening',
      healthStatus: 'good',
      lifecycle: 180,
      cropType: 'cash',
      variety_group: 'kharif',
      expectedYield: 18,
      yieldUnit: 'quintals',
      soilType: 'loam',
      lastFertilizerDate: new Date('2025-07-20'),
      lastSprayDate: new Date('2025-09-05'),
      pestHistory: ['bollworm', 'spider_mite', 'whitefly'],
      diseaseHistory: [],
      notes: 'Good boll opening, ready for picking in phases'
    }
  ]
};

async function seedDemoCrops() {
  let client;
  try {
    console.log('🌱 Seeding demo crops for demo users...\n');
    console.log(`Connecting to MongoDB: ${MONGO_URI}`);

    client = new MongoClient(MONGO_URI);
    await client.connect();

    const db = client.db('FarmConnect');
    const usersCollection = db.collection('users');
    const cropsCollection = db.collection('farmerCrops');

    // Map users to their regions and crops
    const userCropMap = [
      { email: 'ram@farmer.com', region: 'maharashtra', name: 'राम शर्मा' },
      { email: 'priya@farmer.com', region: 'kerala', name: 'Priya Nair' },
      { email: 'harpreet@farmer.com', region: 'punjab', name: 'Harpreet Singh' }
    ];

    let cropsAdded = 0;

    for (const userMapping of userCropMap) {
      console.log(`\n👤 Processing: ${userMapping.name}`);

      // Find user by email or name
      const user = await usersCollection.findOne({
        $or: [
          { email: userMapping.email },
          { name: userMapping.name }
        ]
      });

      if (!user) {
        console.log(`   ❌ User not found (${userMapping.email})`);
        continue;
      }

      console.log(`   ✅ Found user: ${user.email || user.name}`);

      // Check if already has crops
      const existingCrops = await cropsCollection
        .find({ userId: user._id.toString() })
        .toArray();

      if (existingCrops.length > 0) {
        console.log(`   ⏭️  Already has ${existingCrops.length} crops, skipping`);
        continue;
      }

      // Get crops for this region
      const regionCrops = CROPS_BY_REGION[userMapping.region];
      if (!regionCrops) {
        console.log(`   ❌ No crops defined for region: ${userMapping.region}`);
        continue;
      }

      // Add crops with userId
      const cropsToInsert = regionCrops.map(crop => ({
        ...crop,
        userId: user._id.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const result = await cropsCollection.insertMany(cropsToInsert);
      cropsAdded += result.insertedIds.length;

      console.log(`   ✅ Added ${result.insertedIds.length} crops:`);
      cropsToInsert.forEach(crop => {
        console.log(`      • ${crop.cropName} (${crop.variety})`);
      });
    }

    console.log(`\n✨ Successfully added ${cropsAdded} crops!`);

    // Show summary
    const totalCrops = await cropsCollection.countDocuments({});
    const uniqueUsers = await cropsCollection.distinct('userId');
    console.log(`\n📊 Summary:`);
    console.log(`   • Total crops in database: ${totalCrops}`);
    console.log(`   • Users with crops: ${uniqueUsers.length}`);

  } catch (error) {
    console.error('❌ Error seeding crops:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log(`\n✅ Connection closed`);
    }
  }
}

// Run the seed
seedDemoCrops();
