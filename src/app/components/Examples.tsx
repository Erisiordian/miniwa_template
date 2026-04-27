import { BookOpen } from 'lucide-react';

interface ExamplesProps {
  onExampleClick: (example: string) => void;
}

export function Examples({ onExampleClick }: ExamplesProps) {
  const examples = [
    {
      title: 'Definite Integral',
      expression: 'integrate(x^2, x, 0, 1)',
      description: 'Integrate x² from 0 to 1'
    },
    {
      title: 'Trigonometric Integral',
      expression: 'integrate(sin(x), x, 0, pi)',
      description: 'Integrate sin(x) from 0 to π'
    },
    {
      title: 'Derivative',
      expression: "derivative('x^3 + 2*x^2 + x', 'x')",
      description: 'Derivative of x³ + 2x² + x'
    },
    {
      title: 'Exponential Integral',
      expression: 'integrate(exp(x), x, 0, 1)',
      description: 'Integrate eˣ from 0 to 1'
    },
    {
      title: 'Polynomial',
      expression: '(x^2 + 3*x + 2)',
      description: 'Evaluate polynomial expression'
    },
    {
      title: 'Complex Expression',
      expression: 'sin(pi/4)^2 + cos(pi/4)^2',
      description: 'Pythagorean identity'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-blue-500" size={24} />
        <h2 className="text-2xl text-gray-900">Example Problems</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example, index) => (
          <button
            key={index}
            onClick={() => onExampleClick(example.expression)}
            className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div className="text-sm text-orange-600 mb-1">{example.title}</div>
            <div className="text-xs font-mono text-gray-700 mb-2 break-all">
              {example.expression}
            </div>
            <div className="text-xs text-gray-600">{example.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
