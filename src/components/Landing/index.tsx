import { Hero } from './Hero';
import { Features } from './Features';
import { ProblemSolution } from './ProblemSolution';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <main>
      <Hero />
      <Features />
      <ProblemSolution />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Break Your Bad Habits?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start your journey today with AI-powered behavior change coaching.
          </p>
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-white text-purple-600 hover:bg-gray-100 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => (window.location.href = '/onboarding')}
          >
            Start My Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </main>
  );
}
