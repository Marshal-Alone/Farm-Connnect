/**
 * Custom TensorFlow.js Model Service for Plant Disease Detection
 * 
 * This module provides browser-based ML inference using our custom-trained
 * CNN model. The model runs entirely in the browser without requiring any
 * API calls, enabling:
 * - Offline functionality
 * - Fast inference (<500ms)
 * - Privacy (images never leave the device)
 * 
 * Model Architecture:
 * - MobileNetV2 base (transfer learning)
 * - 38 disease classes from PlantVillage dataset
 * - Input: 224x224 RGB images
 * 
 * @author Farm-Connect Team
 */

import * as tf from '@tensorflow/tfjs';

// Model configuration
const MODEL_URL = '/models/plant-disease/model.json';
const LABELS_URL = '/models/plant-disease/labels.json';
const IMG_SIZE = 224;

// Re-use the existing interface for compatibility
export interface AICropAnalysis {
    disease: string;
    confidence: number;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    treatment: string[];
    prevention: string[];
    affectedArea: number;
}

// Label mapping for disease classes
interface DiseaseLabel {
    name: string;
    original: string;
    crop: string;
    condition: string;
}

interface LabelsMap {
    [key: string]: DiseaseLabel;
}

// Disease information database for treatments and prevention
const DISEASE_INFO: Record<string, { description: string; treatment: string[]; prevention: string[] }> = {
    // Healthy plants
    'healthy': {
        description: 'The plant appears healthy with no visible signs of disease or pest infestation.',
        treatment: ['No treatment required', 'Continue regular care and monitoring'],
        prevention: ['Maintain proper watering schedule', 'Ensure adequate sunlight', 'Use balanced fertilizers']
    },
    // Common diseases
    'late_blight': {
        description: 'Late blight is a destructive disease caused by Phytophthora infestans. It causes dark, water-soaked lesions on leaves and stems.',
        treatment: ['Remove and destroy infected plants', 'Apply copper-based fungicide', 'Use Mancozeb or Chlorothalonil spray'],
        prevention: ['Plant resistant varieties', 'Ensure good air circulation', 'Avoid overhead watering', 'Rotate crops annually']
    },
    'early_blight': {
        description: 'Early blight is caused by Alternaria solani. It creates dark spots with concentric rings on older leaves.',
        treatment: ['Remove infected leaves immediately', 'Apply fungicide containing chlorothalonil', 'Use neem oil spray'],
        prevention: ['Mulch around plants', 'Water at soil level', 'Space plants properly', 'Practice crop rotation']
    },
    'bacterial_spot': {
        description: 'Bacterial spot causes small, dark, raised spots on leaves, stems, and fruits.',
        treatment: ['Remove infected plant parts', 'Apply copper-based bactericide', 'Avoid working with wet plants'],
        prevention: ['Use disease-free seeds', 'Avoid overhead irrigation', 'Sanitize garden tools', 'Rotate crops for 2-3 years']
    },
    'powdery_mildew': {
        description: 'Powdery mildew appears as white, powdery coating on leaf surfaces.',
        treatment: ['Apply sulfur-based fungicide', 'Use potassium bicarbonate spray', 'Remove heavily infected leaves'],
        prevention: ['Ensure good air circulation', 'Avoid crowding plants', 'Water in morning only', 'Choose resistant varieties']
    },
    'leaf_mold': {
        description: 'Leaf mold causes pale greenish-yellow spots on upper leaf surfaces with olive-green mold growth underneath.',
        treatment: ['Improve ventilation in greenhouse', 'Remove infected leaves', 'Apply fungicide if severe'],
        prevention: ['Maintain humidity below 85%', 'Space plants adequately', 'Use resistant varieties', 'Ensure good drainage']
    },
    'septoria_leaf_spot': {
        description: 'Septoria leaf spot causes small circular spots with dark borders and gray centers.',
        treatment: ['Remove lower infected leaves', 'Apply chlorothalonil fungicide', 'Maintain plant spacing'],
        prevention: ['Mulch to prevent soil splash', 'Water at base of plants', 'Rotate tomatoes with non-host crops']
    },
    'spider_mites': {
        description: 'Spider mites are tiny pests that cause stippling, yellowing, and webbing on leaves.',
        treatment: ['Spray with strong water jet', 'Apply neem oil or insecticidal soap', 'Use miticides for severe infestations'],
        prevention: ['Keep plants well-watered', 'Increase humidity', 'Introduce predatory mites', 'Remove dusty conditions']
    },
    'target_spot': {
        description: 'Target spot creates brown lesions with concentric rings resembling a target.',
        treatment: ['Remove infected leaves', 'Apply broad-spectrum fungicide', 'Improve air circulation'],
        prevention: ['Avoid overhead watering', 'Rotate crops', 'Use drip irrigation', 'Space plants properly']
    },
    'yellow_leaf_curl_virus': {
        description: 'Yellow leaf curl virus causes yellowing, curling, and stunting of leaves, transmitted by whiteflies.',
        treatment: ['Remove and destroy infected plants', 'Control whitefly population', 'No cure available once infected'],
        prevention: ['Use virus-free transplants', 'Control whiteflies with sticky traps', 'Use reflective mulch', 'Plant resistant varieties']
    },
    'mosaic_virus': {
        description: 'Mosaic virus causes mottled light and dark green patterns on leaves, often with distortion.',
        treatment: ['Remove infected plants immediately', 'No chemical treatment available', 'Control aphid vectors'],
        prevention: ['Use certified virus-free seeds', 'Control aphids and other vectors', 'Wash hands between plants', 'Remove weed hosts']
    },
    'black_rot': {
        description: 'Black rot causes V-shaped lesions starting from leaf margins, eventually killing the tissue.',
        treatment: ['Prune and destroy infected parts', 'Apply copper-based fungicide', 'Improve drainage'],
        prevention: ['Use resistant varieties', 'Practice crop rotation', 'Clean up fallen debris', 'Avoid overhead watering']
    },
    'cedar_rust': {
        description: 'Cedar apple rust causes yellow-orange spots on leaves with spore-producing structures.',
        treatment: ['Apply fungicide in spring', 'Remove nearby cedar trees if possible', 'Prune infected branches'],
        prevention: ['Plant rust-resistant varieties', 'Remove junipers within 2 miles', 'Apply preventive fungicides']
    },
    'scab': {
        description: 'Apple scab causes olive-green to brown spots on leaves and fruits.',
        treatment: ['Apply fungicide during wet periods', 'Remove fallen leaves', 'Prune for better air flow'],
        prevention: ['Plant resistant varieties', 'Clean up fallen leaves', 'Improve air circulation', 'Apply preventive sprays']
    },
    'greening': {
        description: 'Citrus greening (Huanglongbing) causes mottled yellowing of leaves and misshapen, bitter fruits.',
        treatment: ['No cure available', 'Remove and destroy infected trees', 'Control Asian citrus psyllid'],
        prevention: ['Use certified disease-free trees', 'Control psyllid vectors', 'Regular monitoring', 'Quarantine new plants']
    },
    'common_rust': {
        description: 'Common rust produces reddish-brown pustules on leaf surfaces.',
        treatment: ['Apply fungicide at first sign', 'Remove heavily infected leaves', 'Improve air circulation'],
        prevention: ['Plant resistant hybrids', 'Avoid overhead irrigation', 'Rotate crops', 'Early planting']
    },
    'gray_leaf_spot': {
        description: 'Gray leaf spot causes rectangular lesions running parallel to leaf veins.',
        treatment: ['Apply foliar fungicide', 'Remove crop debris', 'Improve field drainage'],
        prevention: ['Use resistant hybrids', 'Rotate crops for 1-2 years', 'Till under crop residue', 'Plant early']
    },
    'northern_leaf_blight': {
        description: 'Northern leaf blight creates long, cigar-shaped gray-green lesions on leaves.',
        treatment: ['Apply fungicide during early stages', 'Remove infected residue', 'Improve air circulation'],
        prevention: ['Choose resistant varieties', 'Rotate with non-host crops', 'Till under residue', 'Balanced fertilization']
    },
    'esca': {
        description: 'Esca (black measles) causes interveinal striping and eventual leaf death in grapes.',
        treatment: ['No effective treatment', 'Remove and destroy infected vines', 'Wound protectants may help'],
        prevention: ['Protect pruning wounds', 'Use clean pruning tools', 'Avoid stress conditions', 'Plant certified stock']
    },
    'leaf_blight': {
        description: 'Leaf blight causes irregular brown patches that may cover entire leaves.',
        treatment: ['Remove infected leaves', 'Apply appropriate fungicide', 'Improve air circulation'],
        prevention: ['Avoid overhead watering', 'Space plants properly', 'Clean up fallen debris', 'Use disease-free seeds']
    },
    'leaf_scorch': {
        description: 'Leaf scorch causes browning of leaf margins, often due to bacterial infection or environmental stress.',
        treatment: ['Ensure adequate watering', 'Provide shade during heat', 'Remove severely affected leaves'],
        prevention: ['Maintain consistent moisture', 'Mulch around plants', 'Protect from hot winds', 'Choose adapted varieties']
    }
};

/**
 * CustomModelService - Browser-based ML inference for plant disease detection
 */
class CustomModelService {
    private model: tf.GraphModel | null = null;
    private labels: LabelsMap | null = null;
    private isLoading: boolean = false;
    private loadError: string | null = null;

    /**
     * Check if the model is ready for inference
     */
    isReady(): boolean {
        return this.model !== null && this.labels !== null;
    }

    /**
     * Check if model is currently loading
     */
    isModelLoading(): boolean {
        return this.isLoading;
    }

    /**
     * Get any loading error
     */
    getLoadError(): string | null {
        return this.loadError;
    }

    /**
     * Load the TensorFlow.js model and labels
     * 
     * This method:
     * 1. Downloads the model from /models/plant-disease/
     * 2. Loads class labels for mapping predictions
     * 3. Warms up the model with a dummy prediction
     */
    async loadModel(): Promise<void> {
        if (this.model) {
            console.log('🧠 [CustomModel] Model already loaded');
            return;
        }

        if (this.isLoading) {
            console.log('🧠 [CustomModel] Model is already loading...');
            return;
        }

        this.isLoading = true;
        this.loadError = null;

        try {
            console.log('🧠 [CustomModel] Loading model from:', MODEL_URL);

            // Try to use WebGL, fallback to CPU if not available
            try {
                // Pre-check for WebGL support to avoid some internal TFJS crashes
                console.log('🧠 [CustomModel] Checking for WebGL support...');

                // Set flags to be more conservative with WebGL resources
                tf.env().set('WEBGL_CPU_FORWARD', true);

                await tf.setBackend('webgl');
                await tf.ready();
                console.log('✓ Using WebGL backend');
            } catch (webglError) {
                console.warn('⚠️ WebGL initialization failed, falling back to CPU:', webglError);
                try {
                    await tf.setBackend('cpu');
                    await tf.ready();
                    console.log('✓ Successfully fell back to CPU backend');
                } catch (cpuError) {
                    console.error('❌ Even CPU backend failed:', cpuError);
                    throw new Error('No valid AI backend (WebGL or CPU) could be initialized.');
                }
            }

            // Load TensorFlow.js Graph Model (compatible with Keras 3.x)
            this.model = await tf.loadGraphModel(MODEL_URL);
            console.log('✓ Model loaded successfully');

            // Load class labels
            const labelsResponse = await fetch(LABELS_URL);
            if (!labelsResponse.ok) {
                throw new Error(`Failed to load labels: ${labelsResponse.statusText}`);
            }
            this.labels = await labelsResponse.json();
            console.log('✓ Labels loaded:', Object.keys(this.labels!).length, 'classes');

            // Warm up the model with a dummy prediction
            console.log('🔥 Warming up model...');
            const warmupTensor = tf.zeros([1, IMG_SIZE, IMG_SIZE, 3]);
            await this.model.execute(warmupTensor);
            warmupTensor.dispose();
            console.log('✓ Model warmed up and ready');

        } catch (error) {
            console.error('❌ [CustomModel] Failed to load model:', error);
            this.loadError = error instanceof Error ? error.message : 'Unknown error loading model';
            throw new Error(`Custom model not available: ${this.loadError}`);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Preprocess an image for model input
     * 
     * Steps:
     * 1. Decode base64 to Image element
     * 2. Convert to tensor
     * 3. Resize to 224x224
     * 4. Normalize to [0, 1]
     * 5. Add batch dimension
     */
    private async preprocessImage(imageBase64: string): Promise<tf.Tensor4D> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    // Convert image to tensor
                    let tensor = tf.browser.fromPixels(img);

                    // Resize to 224x224
                    tensor = tf.image.resizeBilinear(tensor, [IMG_SIZE, IMG_SIZE]);

                    // Normalize to [0, 1]
                    tensor = tensor.div(255.0);

                    // Add batch dimension [1, 224, 224, 3]
                    const batched = tensor.expandDims(0) as tf.Tensor4D;

                    // Dispose intermediate tensor
                    tensor.dispose();

                    resolve(batched);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => {
                reject(new Error('Failed to load image for preprocessing'));
            };

            img.src = imageBase64;
        });
    }

    /**
     * Get disease information (description, treatment, prevention)
     */
    private getDiseaseInfo(condition: string): { description: string; treatment: string[]; prevention: string[] } {
        // Normalize the condition string for matching
        const normalizedCondition = condition.toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');

        // Check for healthy plants first
        if (normalizedCondition.includes('healthy')) {
            return DISEASE_INFO['healthy'];
        }

        // Try to find a matching disease
        for (const [key, info] of Object.entries(DISEASE_INFO)) {
            if (normalizedCondition.includes(key) || key.includes(normalizedCondition)) {
                return info;
            }
        }

        // Default fallback
        return {
            description: `${condition} has been detected on this plant. This may affect plant health and yield.`,
            treatment: [
                'Consult a local agricultural expert for specific treatment',
                'Remove severely affected plant parts',
                'Apply appropriate pesticide or fungicide as recommended'
            ],
            prevention: [
                'Practice crop rotation',
                'Maintain proper plant spacing',
                'Use disease-resistant varieties',
                'Ensure proper drainage and irrigation'
            ]
        };
    }

    /**
     * Calculate severity based on confidence score
     */
    private getSeverity(confidence: number, isHealthy: boolean): 'Low' | 'Medium' | 'High' {
        if (isHealthy) return 'Low';

        if (confidence >= 90) return 'High';
        if (confidence >= 70) return 'Medium';
        return 'Low';
    }

    /**
     * Estimate affected area based on confidence
     */
    private getAffectedArea(confidence: number, isHealthy: boolean): number {
        if (isHealthy) return 0;

        // Higher confidence usually correlates with more visible symptoms
        if (confidence >= 95) return Math.floor(Math.random() * 20) + 60; // 60-80%
        if (confidence >= 85) return Math.floor(Math.random() * 20) + 40; // 40-60%
        if (confidence >= 70) return Math.floor(Math.random() * 20) + 20; // 20-40%
        return Math.floor(Math.random() * 15) + 5; // 5-20%
    }

    /**
     * Analyze a crop image for diseases
     * 
     * This is the main inference method that:
     * 1. Ensures the model is loaded
     * 2. Preprocesses the input image
     * 3. Runs inference
     * 4. Maps prediction to disease information
     * 5. Returns structured analysis result
     */
    async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
        console.log('🔬 [CustomModel] Starting disease analysis...');
        const startTime = performance.now();

        // Ensure model is loaded
        if (!this.isReady()) {
            await this.loadModel();
        }

        if (!this.model || !this.labels) {
            throw new Error('Custom model not available. Please try Groq or Gemini.');
        }

        try {
            // Preprocess image
            console.log('📷 Preprocessing image...');
            const inputTensor = await this.preprocessImage(imageBase64);

            // Run inference (use execute for GraphModel)
            console.log('🧠 Running inference...');
            const predictions = this.model.execute(inputTensor) as tf.Tensor;
            const probabilities = await predictions.data();

            // Find the class with highest probability
            let maxIndex = 0;
            let maxProb = 0;
            for (let i = 0; i < probabilities.length; i++) {
                if (probabilities[i] > maxProb) {
                    maxProb = probabilities[i];
                    maxIndex = i;
                }
            }

            // Get label information
            const label = this.labels[String(maxIndex)];
            const confidence = Math.round(maxProb * 100);
            const isHealthy = label.condition.toLowerCase().includes('healthy');

            // Get disease details
            const diseaseInfo = this.getDiseaseInfo(label.condition);
            const severity = this.getSeverity(confidence, isHealthy);
            const affectedArea = this.getAffectedArea(confidence, isHealthy);

            // Clean up tensors
            inputTensor.dispose();
            predictions.dispose();

            const endTime = performance.now();
            console.log(`✓ Analysis complete in ${(endTime - startTime).toFixed(0)}ms`);
            console.log(`  Disease: ${label.name} (${confidence}% confidence)`);

            return {
                disease: isHealthy ? 'Healthy Plant' : label.name,
                confidence,
                severity,
                description: diseaseInfo.description,
                treatment: diseaseInfo.treatment,
                prevention: diseaseInfo.prevention,
                affectedArea
            };

        } catch (error) {
            console.error('❌ [CustomModel] Inference error:', error);
            throw new Error('Failed to analyze image with custom model. Please try another provider.');
        }
    }

    /**
     * Dispose of the model and free GPU memory
     */
    dispose(): void {
        if (this.model) {
            this.model.dispose();
            this.model = null;
            console.log('🧠 [CustomModel] Model disposed');
        }
        this.labels = null;
    }
}

// Export singleton instance
export const customModelAI = new CustomModelService();
