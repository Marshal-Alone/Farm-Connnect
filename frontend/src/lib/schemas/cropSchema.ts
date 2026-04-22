/**
 * Crop & Action Data Schemas
 */

export interface FieldLocation {
  lat: number;
  lon: number;
  address: string;
}

export interface FarmerCrop {
  _id?: string;
  userId: string;
  cropName: string;           // Rice, Wheat, Cotton, etc.
  variety: string;            // Specific variety
  sowDate: Date | string;     // When sown
  sowingArea: number;         // Size in hectares
  fieldLocation: FieldLocation;
  status: 'sowing' | 'growing' | 'mature' | 'harvested';
  expectedHarvestDate: Date | string;
  harvestDate: Date | string | null;
  notes: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CropAction {
  _id?: string;
  userId: string;
  cropId: string;
  actionType: 'sowing' | 'fertilizing' | 'irrigating' | 'spraying' | 'harvesting' | 'monitoring' | 'other';
  actionDate: Date | string;
  details: string;
  quantity?: number | null;
  quantityUnit?: string | null;  // kg, liters, etc.
  weather?: Record<string, any>;
  createdAt?: Date | string;
}

export interface CropRecommendation {
  _id?: string;
  userId: string;
  cropId: string;
  weatherTimestamp: Date | string;
  recommendation: string;
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  monitoring: string[];
  nextActions: string[];
  createdAt?: Date | string;
  expiresAt?: Date | string;
}

export interface CropStage {
  stage: string;
  daysFromSowing: number;
  description: string;
}

export const CROP_TYPES = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 
  'Potato', 'Tomato', 'Onion', 'Chilli', 'Soybean',
  'Groundnut', 'Gram', 'Linseed', 'Mustard', 'Other'
];

export const ACTION_TYPES = [
  { label: 'Sowing', value: 'sowing', icon: '🌱' },
  { label: 'Fertilizing', value: 'fertilizing', icon: '🧪' },
  { label: 'Irrigating', value: 'irrigating', icon: '💧' },
  { label: 'Spraying (Pesticide)', value: 'spraying', icon: '🔫' },
  { label: 'Harvesting', value: 'harvesting', icon: '✂️' },
  { label: 'Monitoring', value: 'monitoring', icon: '👁️' },
  { label: 'Other', value: 'other', icon: '📝' }
];

/**
 * Calculate crop growth stage from sowing date
 */
export function getCropStage(sowDate: Date | string, cropName: string): CropStage {
  const now = new Date();
  const sow = new Date(sowDate);
  const daysFromSowing = Math.floor((now.getTime() - sow.getTime()) / (1000 * 60 * 60 * 24));

  const stageMap: Record<string, CropStage[]> = {
    'Rice': [
      { stage: 'Pre-sowing', daysFromSowing: 0, description: 'Field preparation' },
      { stage: 'Tillering', daysFromSowing: 15, description: 'Main growth phase' },
      { stage: 'Panicle initiation', daysFromSowing: 60, description: 'Flowering preparation' },
      { stage: 'Flowering', daysFromSowing: 85, description: 'Bloom and pollination' },
      { stage: 'Grain filling', daysFromSowing: 100, description: 'Grain development' },
      { stage: 'Maturity', daysFromSowing: 130, description: 'Ready for harvest' }
    ],
    'Wheat': [
      { stage: 'Germination', daysFromSowing: 0, description: 'Seed sprouting' },
      { stage: 'Tillering', daysFromSowing: 30, description: 'Shoot production' },
      { stage: 'Boot stage', daysFromSowing: 60, description: 'Spike emergence' },
      { stage: 'Flowering', daysFromSowing: 75, description: 'Bloom' },
      { stage: 'Milk stage', daysFromSowing: 85, description: 'Grain development' },
      { stage: 'Dough stage', daysFromSowing: 100, description: 'Grain hardening' },
      { stage: 'Maturity', daysFromSowing: 120, description: 'Ready for harvest' }
    ],
    'Maize': [
      { stage: 'Germination', daysFromSowing: 0, description: 'Seed sprouting' },
      { stage: 'V4 stage', daysFromSowing: 20, description: '4 leaves visible' },
      { stage: 'V8 stage', daysFromSowing: 40, description: '8 leaves visible' },
      { stage: 'VT stage', daysFromSowing: 60, description: 'Tassel emergence' },
      { stage: 'R1 stage', daysFromSowing: 65, description: 'Silking' },
      { stage: 'R3 stage', daysFromSowing: 80, description: 'Milk stage' },
      { stage: 'R6 stage', daysFromSowing: 105, description: 'Physiological maturity' }
    ]
  };

  const stages = stageMap[cropName] || [
    { stage: 'Growing', daysFromSowing: 0, description: 'Active growth period' },
    { stage: 'Maturity', daysFromSowing: 120, description: 'Ready for harvest' }
  ];

  for (let i = stages.length - 1; i >= 0; i--) {
    if (daysFromSowing >= stages[i].daysFromSowing) {
      return { ...stages[i], daysFromSowing };
    }
  }

  return stages[0];
}
