import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ProblemSolution() {
  const problems = [
    'Lack of self-awareness during the moment',
    'Emotional triggers like stress and anxiety',
    'Boredom and dopamine seeking',
    'Automatic habit loops',
    'Loss of time perception',
  ];

  const solutions = [
    'AI identifies your personal triggers',
    'Predicts risky situations before they happen',
    'Provides personalized interventions',
    'Breaks automatic behavior loops',
    'Builds long-term healthy habits',
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Problem */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              The Problem
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              The problem is NOT lack of awareness. Users already know they spend too much time. The real issue is:
            </p>
            <div className="space-y-4">
              {problems.map((problem, index) => (
                <Card key={index} className="border-l-4 border-red-400 bg-red-50/50 dark:bg-red-900/10">
                  <CardContent className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">{problem}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              The Solution
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              HabitMind AI focuses on interrupting behavior loops and providing intelligent, personalized support.
            </p>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <Card key={index} className="border-l-4 border-green-400 bg-green-50/50 dark:bg-green-900/10">
                  <CardContent className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">{solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
