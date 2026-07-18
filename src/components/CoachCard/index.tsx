import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CoachingPlan } from '@/types';
import { MessageSquare, Lightbulb, Target, Clock } from 'lucide-react';

interface CoachCardProps {
  coaching: CoachingPlan;
}

export function CoachCard({ coaching }: CoachCardProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          AI Coaching
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Motivational Message */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
          <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
            {coaching.motivationalMessage}
          </p>
        </div>

        {/* Personalized Suggestion */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Personalized Suggestion</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 pl-7">
            {coaching.personalizedSuggestion}
          </p>
        </div>

        {/* Replacement Activity */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Replacement Activity</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {coaching.replacementActivity.activity}
              </span>
              <Badge variant="outline" className="border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-400">
                {coaching.replacementActivity.duration}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {coaching.replacementActivity.reason}
            </p>
          </div>
        </div>

        {/* Micro Goal */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5" />
            <h4 className="font-semibold">Today's Micro Goal</h4>
          </div>
          <p className="text-lg font-medium mb-2">{coaching.microGoal.goal}</p>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Clock className="w-4 h-4" />
            <span>{coaching.microGoal.timeframe}</span>
          </div>
        </div>

        {/* Reflection Question */}
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Reflection Question</h4>
          </div>
          <p className="text-gray-700 dark:text-gray-300 italic">
            {coaching.reflectionQuestion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
