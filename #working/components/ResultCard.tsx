
import React from 'react';
import { DiagnosisResult } from '../types';
import { CheckCircleIcon, XCircleIcon, WarningIcon, SparklesIcon, LeafIcon, DropletIcon } from './icons';

interface ResultCardProps {
  result: DiagnosisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  if (!result.isPlant) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg" role="alert">
        <div className="flex items-center">
          <WarningIcon className="h-6 w-6 mr-3" />
          <div>
            <p className="font-bold">Not a Plant</p>
            <p>The uploaded image does not appear to be a plant. Please try another image.</p>
          </div>
        </div>
      </div>
    );
  }

  const isHealthy = !result.hasDisease || result.diseaseName.toLowerCase() === 'healthy';

  return (
    <div className="border border-gray-200 rounded-lg p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        {isHealthy ? (
          <CheckCircleIcon className="h-10 w-10 text-green-500 flex-shrink-0" />
        ) : (
          <XCircleIcon className="h-10 w-10 text-red-500 flex-shrink-0" />
        )}
        <div>
          <h2 className={`text-2xl font-bold ${isHealthy ? 'text-green-800' : 'text-red-800'}`}>
            {result.diseaseName}
          </h2>
          <p className="text-gray-600 mt-1">{result.description}</p>
        </div>
      </div>

      {!isHealthy && (
        <>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <LeafIcon className="h-5 w-5 text-gray-500" />
                Possible Causes
            </h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
              {result.possibleCauses.map((cause, index) => (
                <li key={index}>{cause}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                <DropletIcon className="h-5 w-5 text-green-500" />
                Suggested Treatment
            </h3>
            <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
              {result.suggestedTreatment.map((treatment, index) => (
                <li key={index}>{treatment}</li>
              ))}
            </ul>
          </div>
        </>
      )}
       {isHealthy && (
         <div className="mt-6 text-center bg-green-100 p-4 rounded-lg">
            <SparklesIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Your plant looks happy and healthy! Keep up the great work.</p>
         </div>
       )}
    </div>
  );
};

export default ResultCard;
