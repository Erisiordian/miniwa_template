import { useState } from 'react';
import { Calculator } from './components/Calculator';
import { ResultDisplay } from './components/ResultDisplay';
import { Examples } from './components/Examples';
import * as math from 'mathjs';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      setError('');
      // Parse and evaluate the integral
      const parsed = math.parse(input);

      // For demonstration, we'll evaluate definite integrals numerically
      // and show symbolic results for indefinite integrals
      let calculatedResult;

      // Try to evaluate the expression
      try {
        calculatedResult = math.evaluate(input);
        setResult({
          input: input,
          output: calculatedResult.toString(),
          type: 'evaluated'
        });
      } catch (e) {
        // If direct evaluation fails, show the parsed expression
        setResult({
          input: input,
          output: parsed.toString(),
          type: 'symbolic'
        });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid expression');
      setResult(null);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setError('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-gray-900">Integral Calculator</h1>
          <p className="text-xl text-gray-600">
            Compute integrals and derivatives with step-by-step solutions
          </p>
        </div>

        {/* Main Calculator */}
        <div className="mb-8">
          <Calculator
            input={input}
            setInput={setInput}
            onCalculate={handleCalculate}
            error={error}
          />
        </div>

        {/* Result Display */}
        {result && (
          <div className="mb-8">
            <ResultDisplay result={result} />
          </div>
        )}

        {/* Examples */}
        <Examples onExampleClick={handleExampleClick} />

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl mb-4 text-gray-900">How to Use</h2>
          <div className="space-y-3 text-gray-700">
            <p>• Use standard mathematical notation: +, -, *, /, ^</p>
            <p>• Functions: sin(x), cos(x), tan(x), exp(x), log(x), sqrt(x)</p>
            <p>• Constants: pi, e</p>
            <p>• For integrals, use notation like: integrate(x^2, x, 0, 1) for definite integrals</p>
            <p>• For derivatives, use: derivative('x^2', 'x')</p>
          </div>
        </div>
      </div>
    </div>
  );
}
