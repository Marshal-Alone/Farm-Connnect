
export interface DiagnosisResult {
  isPlant: boolean;
  hasDisease: boolean;
  diseaseName: string;
  description: string;
  possibleCauses: string[];
  suggestedTreatment: string[];
}
