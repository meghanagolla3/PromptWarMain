import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200 dark:border-purple-700 mb-8">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            AI-Powered Behavior Change
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            HabitMind AI
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
          An AI Behavior Change Coach that understands your habits, predicts risky moments, and guides you toward healthier routines.
        </p>

        <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Most habit trackers only record data. HabitMind AI understands WHY you fail, identifies patterns, detects triggers, and provides personalized coaching.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => (window.location.href = '/onboarding')}
          >
            Start My Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all duration-300"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Intelligent Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Personalized Coaching</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Adaptive Learning</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
