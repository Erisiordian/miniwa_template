import { Calculator as CalcIcon } from 'lucide-react';

interface CalculatorProps {
  input: string;
  setInput: (value: string) => void;
  onCalculate: () => void;
  error: string;
}

export function Calculator({ input, setInput, onCalculate, error }: CalculatorProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCalculate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="mb-4">
        <label htmlFor="expression" className="block mb-2 text-gray-700">
          Enter your expression:
        </label>
        <input
          id="expression"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., integrate(x^2, x, 0, 1) or derivative('x^3', 'x')"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-lg"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={onCalculate}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <CalcIcon size={20} />
        <span>Calculate</span>
      </button>
    </div>
  );
}
