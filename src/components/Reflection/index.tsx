'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReflectionFormData } from '@/types';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ReflectionProps {
  onComplete: (data: ReflectionFormData) => void;
  coachingPlan: any;
}

export function Reflection({ onComplete, coachingPlan }: ReflectionProps) {
  const [formData, setFormData] = useState<ReflectionFormData>({
    completedGoal: false,
    difficulty: '',
    feeling: '',
    whatHelped: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(formData);
    setIsSubmitting(false);
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          End of Day Reflection
        </CardTitle>
        <CardDescription className="text-base">
          How did your day go? Your goal was: {coachingPlan?.microGoal?.goal}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
              Did you complete today's goal?
            </Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, completedGoal: true })}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.completedGoal
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={formData.completedGoal}
              >
                <div className="text-2xl mb-2">✅</div>
                <div className="font-medium text-gray-900 dark:text-white">Yes, I did it!</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, completedGoal: false })}
                className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                  !formData.completedGoal
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={!formData.completedGoal}
              >
                <div className="text-2xl mb-2">❌</div>
                <div className="font-medium text-gray-900 dark:text-white">Not this time</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-gray-700 dark:text-gray-300">
              What was difficult? (Optional)
            </Label>
            <Textarea
              id="difficulty"
              placeholder="What challenges did you face?"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="min-h-[80px] border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feeling" className="text-gray-700 dark:text-gray-300">
              How do you feel about it? (Optional)
            </Label>
            <Textarea
              id="feeling"
              placeholder="How are you feeling about your progress?"
              value={formData.feeling}
              onChange={(e) => setFormData({ ...formData, feeling: e.target.value })}
              className="min-h-[80px] border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatHelped" className="text-gray-700 dark:text-gray-300">
              What helped you succeed? (Optional)
            </Label>
            <Textarea
              id="whatHelped"
              placeholder="What strategies or support worked well?"
              value={formData.whatHelped}
              onChange={(e) => setFormData({ ...formData, whatHelped: e.target.value })}
              className="min-h-[80px] border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing Reflection...
              </>
            ) : (
              'Complete Reflection'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
