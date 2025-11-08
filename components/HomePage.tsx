import React, { useState } from 'react';
import { Button } from './ui/Button';
import { BusinessType } from '../types';
import { Card } from './ui/Card';
import { CustomSelect, SelectOption } from './ui/CustomSelect';

interface HomePageProps {
  onSelectBusinessType: (type: BusinessType) => void;
}

const RetailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16.012h.01"/><path d="M8 16.012h.01"/><path d="M12 16.012h.01"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"/><path d="m10.1 2.3-.9 4.2C8.6 9 9.8 11.2 12 12c2.2-.8 3.4-3 2.8-5.5l-.9-4.2"/><path d="M12 12v4"/></svg>;
const EcommerceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const ConsultingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SaasIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 10.5-2-2-4 4-2-2"/><path d="M18 13.06A8.72 8.72 0 1 1 12 5.56"/><path d="m22 2-4.5 4.5"/><path d="M17.5 7.5 15 5"/></svg>;
const RealEstateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const CreatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12a5 5 0 1 1 5-5"/><path d="M20.55 10.33 22 12l-1.45 1.67a5 5 0 0 1-8.1 0L11 12l1.45-1.67a5 5 0 0 1 8.1 0Z"/><path d="M12 17a5 5 0 1 1-5 5"/><path d="M3.45 13.67 2 12l1.45-1.67a5 5 0 0 1 8.1 0L13 12l-1.45 1.67a5 5 0 0 1-8.1 0Z"/></svg>;
const CustomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>;


const businessTypes: SelectOption[] = [
  { value: 'retail', label: 'Retail (e.g., Shop, Cafe)', icon: <RetailIcon /> },
  { value: 'ecommerce', label: 'E-commerce', icon: <EcommerceIcon /> },
  { value: 'consulting', label: 'Consulting / Services', icon: <ConsultingIcon /> },
  { value: 'saas', label: 'Software (SaaS)', icon: <SaasIcon /> },
  { value: 'real_estate', label: 'Real Estate', icon: <RealEstateIcon /> },
  { value: 'freelance_creator', label: 'Freelancer / Creator', icon: <CreatorIcon /> },
  { value: 'custom', label: 'Start From Scratch', icon: <CustomIcon /> },
];

export const HomePage: React.FC<HomePageProps> = ({ onSelectBusinessType }) => {
  const [selectedType, setSelectedType] = useState<SelectOption | null>(null);

  const handleSubmit = () => {
    if (selectedType) {
      onSelectBusinessType(selectedType.value as BusinessType);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white">
          Create your <span className="text-blue-500">Business Plan</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300">
          Kickstart your financial forecast. Select your business model to begin with a tailored template.
        </p>
        
        <Card className="mt-10 text-left">
          <label htmlFor="business-type-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            What type of business are you starting?
          </label>
          <CustomSelect
            options={businessTypes}
            value={selectedType}
            onChange={setSelectedType}
            placeholder="Choose your business type..."
          />
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedType}
            className="w-full mt-4 !py-3 text-base"
          >
            Get Started
          </Button>
        </Card>
      </div>
    </div>
  );
};