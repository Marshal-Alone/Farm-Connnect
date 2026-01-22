import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Upload,
  Scan,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Clock,
  Leaf,
  Bug,
  Droplets,
  Thermometer,
  Brain,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeCropImage } from "@/lib/ai";
import { detectionStorage } from "@/lib/detections";
import { useAuth } from "@/contexts/AuthContext";
import type { DetectionRecord, SimilarCase } from "@/lib/detections";
import SEO from "@/components/SEO";

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string[];
  prevention: string[];
  affectedArea: number;
}

export default function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [recentDetections, setRecentDetections] = useState<DetectionRecord[]>([]);
  const [similarCases, setSimilarCases] = useState<SimilarCase[]>([]);
  const [showSimilarCases, setShowSimilarCases] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load recent detections on component mount
  React.useEffect(() => {
    setRecentDetections(detectionStorage.getRecentDetections(user?.id));
  }, [user?.id]);

  // Mock detection results
  const mockResults: DetectionResult[] = [
    {
      disease: "Late Blight",
      confidence: 94.5,
      severity: 'High',
      description: "Phytophthora infestans causing dark, water-soaked lesions on leaves and stems.",
      treatment: [
        "Apply copper-based fungicide immediately",
        "Remove and destroy infected plant parts",
        "Improve air circulation around plants",
        "Apply protective fungicide every 7-10 days"
      ],
      prevention: [
        "Plant resistant varieties",
        "Ensure proper plant spacing",
        "Avoid overhead watering",
        "Apply preventive fungicide during humid conditions"
      ],
      affectedArea: 15
    },
    {
      disease: "Healthy Plant",
      confidence: 97.2,
      severity: 'Low',
      description: "No disease symptoms detected. Plant appears healthy with good leaf structure.",
      treatment: ["Continue regular care", "Monitor for early signs of stress"],
      prevention: [
        "Maintain proper watering schedule",
        "Ensure adequate nutrition",
        "Regular monitoring for pests"
      ],
      affectedArea: 0
    }
  ];

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
        toast({
          title: "Image Uploaded",
          description: "Ready for AI analysis",
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid image file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      let analysisResult: DetectionResult;

      if (useAI) {
        // Use AI Analysis for real analysis
        const aiResult = await analyzeCropImage(selectedImage);
        analysisResult = aiResult;

        toast({
          title: "AI Analysis Complete",
          description: `AI Analysis analysis with ${aiResult.confidence}% confidence`,
        });
      } else {
        // Simulate AI analysis with mock data
        await new Promise(resolve => setTimeout(resolve, 3000));
        analysisResult = mockResults[Math.floor(Math.random() * mockResults.length)];

        toast({
          title: "Mock Analysis Complete",
          description: `Simulated analysis with ${analysisResult.confidence}% confidence`,
        });
      }

      setResult(analysisResult);

      // Save detection to storage
      const savedDetection = await detectionStorage.saveDetection({
        crop: 'Unknown Crop', // You could add crop detection logic here
        disease: analysisResult.disease,
        confidence: analysisResult.confidence,
        severity: analysisResult.severity,
        treatment: analysisResult.treatment,
        userId: user?.id,
        location: user?.location
      });

      // Update recent detections
      setRecentDetections(detectionStorage.getRecentDetections(user?.id));

    } catch (error) {
      console.error('Analysis error:', error);

      // Fallback to mock result on error
      const fallbackResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(fallbackResult);

      toast({
        title: "Analysis Error",
        description: "Using fallback analysis. Please check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewSimilarCases = () => {
    if (result) {
      const cases = detectionStorage.getSimilarCases(result.disease, user?.location);
      setSimilarCases(cases);
      setShowSimilarCases(true);

      toast({
        title: "Similar Cases Found",
        description: `Found ${cases.length} similar cases in your area`,
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-destructive';
      case 'Medium': return 'bg-warning';
      case 'Low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <>
      <SEO
        title="AI Crop Disease Detection - Scan & Diagnose Plants | FarmConnect"
        description="Upload a photo of your crop to instantly detect diseases using AI. Get treatment recommendations and save your harvest."
        url="https://farmbro.vercel.app/disease-detection"
      />
      <div className="min-h-screen bg-background py-8">
        <div className="container px-6">
          {/* Header */}
          <div className="text-center mb-8">
            {/* <Badge variant="outline" className="mb-4">
            <Brain className="w-3 h-3 mr-1" />
            AI Disease Detection
          </Badge> */}
            <div className="flex items-center justify-center mt-9 space-x-4">
              <Badge
                variant="outline"
                className="px-4 py-1.5 text-sm font-medium bg-primary/5 border-primary/20 text-primary flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Disease Detection
              </Badge>
            </div>
            <br />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 hidden">
              Crop Disease Detection
              <span className="block text-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Powered by AI Analysis
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your crop to get instant AI-powered disease identification
              with treatment recommendations from agricultural experts.
            </p>

            {/* AI Toggle */}
            {/* <div className="flex items-center justify-center mt-6 space-x-4">
            <Badge 
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium bg-primary/5 border-primary/20 text-primary flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              AI Disease Detection
            </Badge>
          </div> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Plant Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {selectedImage ? (
                      <div className="space-y-4">
                        <img
                          src={selectedImage}
                          alt="Selected crop"
                          className="max-h-64 mx-auto rounded-lg shadow-md"
                        />
                        <p className="text-sm text-muted-foreground">
                          Image ready for analysis
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">Drop your image here</p>
                          <p className="text-sm text-muted-foreground">
                            or click to browse files
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Simulate camera capture
                        toast({
                          title: "Camera Feature",
                          description: "Camera integration coming soon!",
                        });
                      }}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>

                  {/* Analysis Button */}
                  {selectedImage && (
                    <div className="mt-6 space-y-4">
                      {isAnalyzing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Analyzing image...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}

                      <Button
                        className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
                        onClick={startAnalysis}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Scan className="w-4 h-4 mr-2 animate-spin" />
                            {useAI ? 'AI Analyzing...' : 'Analyzing...'}
                          </>
                        ) : (
                          <>
                            {useAI ? (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                Start AI Analysis
                              </>
                            ) : (
                              <>
                                <Scan className="w-4 h-4 mr-2" />
                                Start Demo Analysis
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Photography Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success" />
                      Capture affected leaves clearly
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success" />
                      Use good lighting (natural preferred)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success" />
                      Focus on disease symptoms
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-success" />
                      Include multiple affected areas
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Detection Result */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          {result.disease === "Healthy Plant" ? (
                            <CheckCircle className="w-5 h-5 mr-2 text-success" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                          )}
                          Detection Result
                        </span>
                        <Badge className={getSeverityColor(result.severity)}>
                          {result.severity} Risk
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{result.disease}</h3>
                        <p className="text-muted-foreground">{result.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Confidence Level</span>
                          <div className="text-xl font-semibold text-primary">
                            {result.confidence}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Affected Area</span>
                          <div className="text-xl font-semibold">
                            {result.affectedArea}%
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Detection Confidence</span>
                          <span>{result.confidence}%</span>
                        </div>
                        <Progress value={result.confidence} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Treatment & Prevention */}
                  <Card>
                    <CardContent className="p-0">
                      <Tabs defaultValue="treatment" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="treatment">Treatment</TabsTrigger>
                          <TabsTrigger value="prevention">Prevention</TabsTrigger>
                        </TabsList>

                        <TabsContent value="treatment" className="p-6 space-y-4">
                          <h3 className="font-semibold text-lg">Recommended Treatment</h3>
                          <ul className="space-y-3">
                            {result.treatment.map((step, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <Badge variant="outline" className="mt-0.5">
                                  {index + 1}
                                </Badge>
                                <span className="text-sm">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>

                        <TabsContent value="prevention" className="p-6 space-y-4">
                          <h3 className="font-semibold text-lg">Prevention Methods</h3>
                          <ul className="space-y-3">
                            {result.prevention.map((step, index) => (
                              <li key={index} className="flex items-start space-x-3">
                                <CheckCircle className="w-4 h-4 mt-0.5 text-success" />
                                <span className="text-sm">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <MapPin className="w-4 h-4 mr-2" />
                        Find Nearby Agricultural Store
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Schedule Expert Consultation
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={handleViewSimilarCases}>
                        <Users className="w-4 h-4 mr-2" />
                        View Similar Cases
                      </Button>
                    </CardContent>
                  </Card>
                  {/* Similar Cases Modal/Section */}
                  {showSimilarCases && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Similar Cases Nearby
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => setShowSimilarCases(false)}>
                            ✕
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {similarCases.map((case_, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-muted/20">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{case_.farmerName}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {case_.location} • {case_.distance}km away
                                  </p>
                                </div>
                                <Badge variant={case_.outcome === 'Successful' ? 'default' : case_.outcome === 'Partial' ? 'secondary' : 'destructive'}>
                                  {case_.outcome}
                                </Badge>
                              </div>
                              <div className="text-sm">
                                <p className="mb-2">
                                  <strong>{case_.crop}</strong> affected by <strong>{case_.disease}</strong>
                                </p>
                                <p className="text-muted-foreground">
                                  Treatment: {case_.treatment}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(case_.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {similarCases.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              No similar cases found in your area
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Scan className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Ready for Analysis</h3>
                        <p className="text-muted-foreground">
                          Upload a plant image to get AI-powered disease detection results
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Recent Detections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDetections.length > 0 ? (
                  recentDetections.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.crop} - {item.disease}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()} • {item.confidence}% confidence
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getSeverityTextColor(item.severity)}
                      >
                        {item.severity}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No previous detections. Upload your first image to get started!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
