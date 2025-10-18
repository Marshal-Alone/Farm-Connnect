interface DetectionRecord {
  id: string;
  crop: string;
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  date: string;
  imageUrl?: string;
  location?: string;
  treatment?: string[];
  userId?: string;
}

interface SimilarCase {
  farmerId: string;
  farmerName: string;
  location: string;
  crop: string;
  disease: string;
  treatment: string;
  outcome: 'Successful' | 'Partial' | 'Failed';
  date: string;
  distance: number; // in km
}

class DetectionStorageService {
  private STORAGE_KEY = 'disease_detections';
  private SIMILAR_CASES_KEY = 'similar_cases';

  // Get recent detections for current user
  getRecentDetections(userId?: string): DetectionRecord[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const detections: DetectionRecord[] = stored ? JSON.parse(stored) : [];
    
    if (userId) {
      return detections.filter(d => d.userId === userId).slice(0, 10);
    }
    
    return detections.slice(0, 10);
  }

  // Save a new detection
  saveDetection(detection: Omit<DetectionRecord, 'id' | 'date'>): DetectionRecord {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const detections: DetectionRecord[] = stored ? JSON.parse(stored) : [];
    
    const newDetection: DetectionRecord = {
      ...detection,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    detections.unshift(newDetection);
    
    // Keep only last 50 detections
    if (detections.length > 50) {
      detections.splice(50);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(detections));
    return newDetection;
  }

  // Get similar cases for a disease
  getSimilarCases(disease: string, location?: string): SimilarCase[] {
    // Mock similar cases data
    const mockCases: SimilarCase[] = [
      {
        farmerId: 'f1',
        farmerName: 'Rajesh Kumar',
        location: 'Pune, Maharashtra',
        crop: 'Tomato',
        disease: 'Late Blight',
        treatment: 'Applied copper fungicide and improved drainage',
        outcome: 'Successful',
        date: '2025-01-10',
        distance: 12.5
      },
      {
        farmerId: 'f2',
        farmerName: 'Priya Sharma',
        location: 'Nashik, Maharashtra',
        crop: 'Tomato',
        disease: 'Late Blight',
        treatment: 'Used organic neem spray and removed affected plants',
        outcome: 'Partial',
        date: '2025-01-08',
        distance: 45.2
      },
      {
        farmerId: 'f3',
        farmerName: 'Amit Patel',
        location: 'Aurangabad, Maharashtra',
        crop: 'Potato',
        disease: 'Late Blight',
        treatment: 'Preventive copper spray and proper spacing',
        outcome: 'Successful',
        date: '2025-01-05',
        distance: 78.1
      },
      {
        farmerId: 'f4',
        farmerName: 'Sunita Devi',
        location: 'Kolhapur, Maharashtra',
        crop: 'Tomato',
        disease: 'Early Blight',
        treatment: 'Regular fungicide application and crop rotation',
        outcome: 'Successful',
        date: '2023-12-28',
        distance: 89.3
      },
      {
        farmerId: 'f5',
        farmerName: 'Vikram Singh',
        location: 'Solapur, Maharashtra',
        crop: 'Wheat',
        disease: 'Rust Disease',
        treatment: 'Resistant variety planting and timely fungicide',
        outcome: 'Successful',
        date: '2023-12-25',
        distance: 95.7
      }
    ];

    // Filter by disease and sort by distance
    return mockCases
      .filter(case_ => case_.disease.toLowerCase().includes(disease.toLowerCase()))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }

  // Clear all detections (for testing)
  clearDetections(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const detectionStorage = new DetectionStorageService();
export type { DetectionRecord, SimilarCase };
