import { CheckCircle } from 'lucide-react';

interface ResultDisplayProps {
  result: {
    input: string;
    output: string;
    type: string;
  };
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="text-green-500" size={24} />
        <h2 className="text-2xl text-gray-900">Result</h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Input:</div>
          <div className="text-lg text-gray-900 font-mono">{result.input}</div>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-gray-600 mb-1">Output:</div>
          <div className="text-2xl text-orange-900 font-mono break-all">{result.output}</div>
        </div>

        {result.type === 'symbolic' && (
          <div className="text-sm text-gray-600 italic">
            Note: Showing symbolic representation. For numerical results, try evaluating at specific points.
          </div>
        )}
      </div>
    </div>
  );
}
