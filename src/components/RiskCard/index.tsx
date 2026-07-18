import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskPrediction } from '@/types';
import { RISK_LEVEL_CONFIG } from '@/constants';
import { AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';

interface RiskCardProps {
  risk: RiskPrediction;
}

export function RiskCard({ risk }: RiskCardProps) {
  const config = RISK_LEVEL_CONFIG[risk.riskLevel];
  const Icon = risk.riskLevel === 'high' ? AlertTriangle : risk.riskLevel === 'medium' ? Shield : CheckCircle2;

  return (
    <Card className={`border-2 ${config.borderColor} ${config.bgColor} shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
            <Icon className={`w-6 h-6 ${config.textColor}`} />
            Risk Assessment
          </CardTitle>
          <Badge className={`${config.color} text-white border-0`}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-white">Key Factors</h4>
          <div className="space-y-2">
            {risk.factors.map((factor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">{factor.factor}</span>
                <Badge
                  variant="outline"
                  className={
                    factor.impact === 'negative'
                      ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                      : factor.impact === 'positive'
                      ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400'
                      : 'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-400'
                  }
                >
                  {factor.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 dark:text-white">AI Confidence</h4>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {risk.confidence}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${risk.confidence}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Reasoning</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {risk.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
