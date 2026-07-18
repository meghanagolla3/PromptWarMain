import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface Step1Props {
  name: string;
  setName: (name: string) => void;
}

export function Step1({ name, setName }: Step1Props) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
          <User className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
          Welcome! Let's get to know you
        </CardTitle>
        <CardDescription className="text-base">
          What should we call you?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg h-12 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-500"
            aria-required="true"
            aria-describedby="name-description"
          />
          <p id="name-description" className="text-sm text-gray-500 dark:text-gray-400">
            We'll use this to personalize your experience
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
