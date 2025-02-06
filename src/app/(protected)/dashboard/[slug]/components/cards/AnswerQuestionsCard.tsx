'use client';

import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export function AnswerQuestionsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-6 h-6 text-purple-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Answer Questions</h3>
          <p className="text-sm text-gray-500 mb-4">Set up automated responses to common questions.</p>
          <Button variant="outline" className="w-full justify-center">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
