
import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (value: SelectOption | null) => void;
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-base rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full p-3 flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? (
          <span className="flex items-center">
            <span className="mr-3 text-gray-500 dark:text-gray-400">{value.icon}</span>
            {value.label}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
        )}
        <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-4 py-3 text-base text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
              role="option"
              aria-selected={value?.value === option.value}
            >
              <span className="mr-3 text-gray-500 dark:text-gray-400">{option.icon}</span>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
