'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Sparkles, ThumbsUp, X } from 'lucide-react';
import { markNudgeResponded } from '@/lib/api';

interface Nudge {
  id: string;
  message: string;
  context: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: string | Date;
  responded: boolean;
}

interface NudgeCardProps {
  nudge: Nudge;
  onDismiss?: (id: string) => void;
}

const PRIORITY_CONFIG = {
  low: { color: 'bg-blue-500', border: 'border-blue-200 dark:border-blue-800', bg: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20' },
  medium: { color: 'bg-orange-500', border: 'border-orange-200 dark:border-orange-800', bg: 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20' },
  high: { color: 'bg-red-500', border: 'border-red-200 dark:border-red-800', bg: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20' },
};

export function NudgeCard({ nudge, onDismiss }: NudgeCardProps) {
  const [responded, setResponded] = useState(nudge.responded);
  const config = PRIORITY_CONFIG[nudge.priority];

  const handleRespond = async () => {
    setResponded(true);
    await markNudgeResponded(nudge.id, true);
  };

  const handleDismiss = async () => {
    await markNudgeResponded(nudge.id, false);
    onDismiss?.(nudge.id);
  };

  return (
    <Card className={`border-2 ${config.border} bg-gradient-to-br ${config.bg} shadow-lg`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Smart Nudge
          </CardTitle>
          <Badge className={`${config.color} text-white border-0`}>
            {nudge.priority} priority
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {nudge.message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          {nudge.context}
        </p>
        {!responded && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleRespond}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex-1"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              This helped
            </Button>
            <Button
              onClick={handleDismiss}
              size="sm"
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {responded && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 pt-2">
            <Sparkles className="w-4 h-4" />
            Thanks for the feedback!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
