<script src="https://cdn.tailwindcss.com"></script>
import React from 'react';
import { Button } from './ui/Button';

interface HeaderProps {
  onStartOver?: () => void;
  onPrint?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onStartOver, onPrint, onLogout, isAuthenticated }) => {
  return (
    <header className="py-8 text-center relative">
      {onStartOver && (
        <button 
          onClick={onStartOver}
          className="absolute top-1/2 -translate-y-1/2 left-0 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          &larr; Start Over
        </button>
      )}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          Business <span className="text-blue-500">Plan</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Input your business financials and get instant calculations and strategic advice to guide your next move.
        </p>
      </div>
       <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-3">
          {onPrint && (
            <Button onClick={onPrint} variant="secondary">
              Print Summary
            </Button>
          )}
          {isAuthenticated && onLogout && (
             <Button onClick={onLogout} variant="danger">
              Logout
            </Button>
          )}
        </div>
    </header>
  );
};