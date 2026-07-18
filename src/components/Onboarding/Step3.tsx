import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COACHING_STYLE_OPTIONS, AGE_GROUPS } from '@/constants';
import { CoachingStyle } from '@/types';
import { MessageSquare } from 'lucide-react';

interface Step3Props {
  coachingStyle: CoachingStyle;
  setCoachingStyle: (style: CoachingStyle) => void;
  ageGroup?: string;
  setAgeGroup: (age: string) => void;
  occupation?: string;
  setOccupation: (occupation: string) => void;
}

export function Step3({ 
  coachingStyle, 
  setCoachingStyle, 
  ageGroup, 
  setAgeGroup, 
  occupation, 
  setOccupation 
}: Step3Props) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
          How should we coach you?
        </CardTitle>
        <CardDescription className="text-base">
          Choose your preferred coaching style and share some optional details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Coaching Style
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COACHING_STYLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCoachingStyle(option.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  coachingStyle === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={coachingStyle === option.value}
                aria-label={`Select ${option.label} coaching style`}
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

        <div className="space-y-3">
          <Label htmlFor="ageGroup" className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Age Group (Optional)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AGE_GROUPS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAgeGroup(option.value)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  ageGroup === option.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
                }`}
                aria-pressed={ageGroup === option.value}
                aria-label={`Select ${option.label}`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation" className="text-gray-700 dark:text-gray-300 text-lg font-medium">
            Occupation (Optional)
          </Label>
          <Input
            id="occupation"
            type="text"
            placeholder="e.g., Student, Software Engineer, Teacher"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500"
            aria-describedby="occupation-description"
          />
          <p id="occupation-description" className="text-sm text-gray-500 dark:text-gray-400">
            This helps us provide more relevant coaching
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
