import { MOOD_OPTIONS } from '@/constants';
import { MoodType } from '@/types';
import { Label } from '@/components/ui/label';

interface MoodSelectorProps {
  mood: MoodType;
  setMood: (mood: MoodType) => void;
}

export function MoodSelector({ mood, setMood }: MoodSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
        How are you feeling today?
      </Label>
      <div className="grid grid-cols-5 gap-3">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMood(option.value)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
              mood === option.value
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
            }`}
            aria-pressed={mood === option.value}
            aria-label={`Select ${option.label} mood`}
          >
            <div className="text-3xl mb-2">{option.emoji}</div>
            <div className="text-xs font-medium text-gray-900 dark:text-white">
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
