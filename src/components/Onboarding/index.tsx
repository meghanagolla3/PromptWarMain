'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { OnboardingFormData, HabitType, GoalType, CoachingStyle } from '@/types';
import { saveUserProfile } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    habit: 'instagram' as HabitType,
    goal: 'reduce_usage' as GoalType,
    coachingStyle: 'friendly' as CoachingStyle,
    ageGroup: '',
    occupation: '',
  });

  const steps = [
    { number: 1, title: 'Your Name' },
    { number: 2, title: 'Your Habit' },
    { number: 3, title: 'Coaching Style' },
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.habit && formData.goal;
      case 3:
        return formData.coachingStyle;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    const userProfile = {
      id: crypto.randomUUID(),
      name: formData.name,
      habit: formData.habit,
      goal: formData.goal,
      coachingStyle: formData.coachingStyle,
      ...(formData.ageGroup && { ageGroup: formData.ageGroup }),
      ...(formData.occupation && { occupation: formData.occupation }),
      createdAt: new Date(),
    };

    await saveUserProfile(userProfile);
    router.push('/checkin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                    aria-current={currentStep === step.number ? 'step' : undefined}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${
                      currentStep === step.number
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {step.number < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <Step1
                name={formData.name}
                setName={(name) => setFormData({ ...formData, name })}
              />
            )}
            {currentStep === 2 && (
              <Step2
                habit={formData.habit}
                setHabit={(habit) => setFormData({ ...formData, habit })}
                goal={formData.goal}
                setGoal={(goal) => setFormData({ ...formData, goal })}
              />
            )}
            {currentStep === 3 && (
              <Step3
                coachingStyle={formData.coachingStyle}
                setCoachingStyle={(coachingStyle) => setFormData({ ...formData, coachingStyle })}
                ageGroup={formData.ageGroup}
                setAgeGroup={(ageGroup) => setFormData({ ...formData, ageGroup })}
                occupation={formData.occupation}
                setOccupation={(occupation) => setFormData({ ...formData, occupation })}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-6 border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentStep === 3 ? 'Start Journey' : 'Next'}
                {currentStep < 3 && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
