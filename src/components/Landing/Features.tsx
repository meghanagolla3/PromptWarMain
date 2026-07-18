import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Shield, TrendingUp, Lightbulb, Clock } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Brain,
      title: 'Intelligent Analysis',
      description: 'AI understands your behavioral patterns, emotional triggers, and habit loops to provide deep insights.',
    },
    {
      icon: Target,
      title: 'Risk Prediction',
      description: 'Predicts high-risk moments before they happen, allowing you to prepare and stay in control.',
    },
    {
      icon: Shield,
      title: 'Adaptive Coaching',
      description: 'Personalized interventions that adapt to your current state, mood, and environment.',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visual dashboards showing your streaks, mood trends, and habit frequency over time.',
    },
    {
      icon: Lightbulb,
      title: 'AI Insights',
      description: 'Discovers patterns you might miss - like how stress affects your habits or time-based triggers.',
    },
    {
      icon: Clock,
      title: 'Smart Nudges',
      description: 'Timely, personalized reminders based on your historical data and current situation.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powered by AI, Designed for You
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlike simple habit trackers, HabitMind AI uses generative AI to reason, analyze, predict, and coach you through behavior change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-purple-100 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
