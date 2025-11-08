
import React from 'react';
import { Card } from './ui/Card';

interface GeminiSuggestionsProps {
  suggestions: string;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 pt-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
    </div>
);

export const GeminiSuggestions: React.FC<GeminiSuggestionsProps> = ({ suggestions, isLoading }) => {

    const formattedSuggestions = suggestions
        .replace(/\*\*(.*?)\*\*/g, '<h3 class="text-md font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h3>')
        .replace(/\* (.*?)\n/g, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return (
    <Card>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Strategic Analysis</h2>
        {isLoading ? (
            <LoadingSkeleton />
        ) : suggestions ? (
            <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: formattedSuggestions }} />
        ) : (
            <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l.707.707M6.343 17.657l.707.707m12.728 0l-.707-.707M12 21v-1" />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Analysis will appear here</h3>
                <p className="mt-1 text-sm text-gray-500">Click "Get Suggestions" to generate insights.</p>
            </div>
        )}
    </Card>
  );
};