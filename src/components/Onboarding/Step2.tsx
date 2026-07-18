import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HABIT_OPTIONS, GOAL_OPTIONS } from '@/constants';
import { HabitType, GoalType } from '@/types';
import { Target } from 'lucide-react';

interface Step2Props {
  habit: HabitType;
  setHabit: (habit: HabitType) => void;
  goal: GoalType;
  setGoal: (goal: GoalType) => void;
}

export function Step2({ habit, setHabit, goal, setGoal }: Step2Props) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
          <Target className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
          What habit do you want to change?
        </CardTitle>
        <CardDescription className="text-base">
          Select the habit you want to reduce or overcome
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Your Habit
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HABIT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setHabit(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  habit === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={habit === option.value}
                aria-label={`Select ${option.label}`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Your Goal
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setGoal(option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  goal === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={goal === option.value}
                aria-label={`Select ${option.label}`}
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {option.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
