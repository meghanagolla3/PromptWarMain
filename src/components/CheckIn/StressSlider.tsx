import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface StressSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description: string;
  icon: string;
}

export function StressSlider({ value, onChange, label, description, icon }: StressSliderProps) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{icon}</div>
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                {label}
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
            <div className="space-y-3">
              <Slider
                value={[value]}
                onValueChange={(values) => onChange(Array.isArray(values) ? values[0] : values)}
                min={1}
                max={10}
                step={1}
                className="w-full"
                aria-label={label}
                aria-valuemin={1}
                aria-valuemax={10}
                aria-valuenow={value}
              />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Low (1)</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {value}
                </span>
                <span>High (10)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
