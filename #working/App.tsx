
import React, { useState, useCallback } from 'react';
import { DiagnosisResult } from './types';
import { identifyDisease } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import Spinner from './components/Spinner';
import { PlantIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null);
    setError(null);
  };

  const handleDiagnose = useCallback(async () => {
    if (!imageFile) {
      setError('Please select an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const result = await identifyDisease(imageFile);
      setDiagnosis(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get a diagnosis. The model may be busy or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800 tracking-tight">
            Plant Disease Identifier
          </h1>
          <p className="mt-2 text-lg text-green-700">
            Upload a photo of your plant to get an AI-powered diagnosis.
          </p>
        </header>

        <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <ImageUploader onImageSelect={handleImageSelect} previewUrl={previewUrl} />

          <div className="mt-6 text-center">
            <button
              onClick={handleDiagnose}
              disabled={!imageFile || isLoading}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {isLoading ? 'Diagnosing...' : 'Diagnose Plant'}
            </button>
          </div>

          <div className="mt-8">
            {isLoading && <Spinner />}
            {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
            {diagnosis && <ResultCard result={diagnosis} />}
            {!isLoading && !diagnosis && !error && !previewUrl && (
              <div className="text-center text-gray-500 py-10">
                <PlantIcon className="mx-auto h-20 w-20 text-green-300" />
                <p className="mt-4 text-xl">Your plant's health check-up starts here.</p>
                <p className="text-gray-400">Upload an image to begin.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by AI Analysis. Diagnosis may not be 100% accurate. Consult a professional for serious issues.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
