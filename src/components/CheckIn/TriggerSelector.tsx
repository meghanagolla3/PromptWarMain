import { TRIGGER_OPTIONS } from '@/constants';
import { TriggerType } from '@/types';
import { Label } from '@/components/ui/label';

interface TriggerSelectorProps {
  triggers: TriggerType[];
  setTriggers: (triggers: TriggerType[]) => void;
}

export function TriggerSelector({ triggers, setTriggers }: TriggerSelectorProps) {
  const toggleTrigger = (trigger: TriggerType) => {
    if (triggers.includes(trigger)) {
      setTriggers(triggers.filter((t) => t !== trigger));
    } else {
      setTriggers([...triggers, trigger]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
        What triggered you? (Select all that apply)
      </Label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {TRIGGER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleTrigger(option.value)}
            className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
              triggers.includes(option.value)
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800'
            }`}
            aria-pressed={triggers.includes(option.value)}
            aria-label={`Toggle ${option.label} trigger`}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <div className="text-xs font-medium text-gray-900 dark:text-white">
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
