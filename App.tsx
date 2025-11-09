import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BusinessPlanForm } from './components/BusinessPlanForm';
import { FinancialSummary } from './components/FinancialSummary';
import { GeminiSuggestions } from './components/GeminiSuggestions';
import { Header } from './components/Header';
import { Button } from './components/ui/Button';
import { BusinessPlan, BusinessType, CompanyDetails } from './types';
import { calculateFinancials } from './utils/financialCalculations';
import { generateBusinessPlanAnalysis } from './services/geminiService';
import { HomePage } from './components/HomePage';
import { businessPlanPresets } from './utils/businessPlanPresets';
import { PrintSummary } from './components/PrintSummary';
import { AuthModal } from './components/AuthModal';

const App: React.FC = () => {
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [activeYearIndex, setActiveYearIndex] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Auth & Company State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  
  // Check for logged-in user and company details on initial load
  useEffect(() => {
    if (localStorage.getItem('user_email')) {
      setIsAuthenticated(true);
    }
    const storedCompanyDetails = localStorage.getItem('company_details');
    if (storedCompanyDetails) {
      setCompanyDetails(JSON.parse(storedCompanyDetails));
    }
  }, []);

  const printElement = document.getElementById('print-summary-wrapper');

  const financialSummaries = useMemo(() => {
    if (!plan) return [];
    return plan.years.map(yearData => calculateFinancials(yearData));
  }, [plan]);

  const handleSelectBusinessType = useCallback((type: BusinessType) => {
    const preset = businessPlanPresets[type];
    const newPlan = JSON.parse(JSON.stringify(preset));
    // If company details exist, pre-fill the business name
    if (companyDetails) {
      newPlan.businessName = companyDetails.name;
    }
    setPlan(newPlan);
    setActiveYearIndex(0);
    setSuggestions('');
    setError(null);
  }, [companyDetails]);
  
  const handleStartOver = useCallback(() => {
    setPlan(null);
    setSuggestions('');
    setError(null);
  }, []);

  const handleAddYear = () => {
    setPlan(prevPlan => {
      if (!prevPlan || prevPlan.years.length === 0) return prevPlan;
      const lastYear = prevPlan.years[prevPlan.years.length - 1];
      const newYear = JSON.parse(JSON.stringify(lastYear));
      const updatedPlan = {
        ...prevPlan,
        years: [...prevPlan.years, newYear]
      };
      setActiveYearIndex(updatedPlan.years.length - 1);
      return updatedPlan;
    });
  };

  const handleGetSuggestions = useCallback(async () => {
    if (!plan || financialSummaries.length === 0) return;
    setIsLoading(true);
    setError(null);
    setSuggestions('');
    try {
      const result = await generateBusinessPlanAnalysis(plan, financialSummaries);
      setSuggestions(result);
    } catch (err) {
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [plan, financialSummaries]);
  
  const executePrint = useCallback(() => {
    const printContents = document.getElementById('print-summary-wrapper')?.innerHTML;
    if (!plan || !printContents) {
      console.error("Print summary content not found.");
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Could not open print window. Please disable your popup blocker.');
      return;
    }
    printWindow.document.write(`
      <html><head><title>${companyDetails?.name || plan.businessName} - Financial Summary</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>body { font-family: 'Inter', sans-serif; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style>
      </head><body class="bg-white">${printContents}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }, [plan, companyDetails]);

  const handlePrint = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    executePrint();
  };

  const handleLoginSuccess = (newCompanyDetails?: CompanyDetails) => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    if (newCompanyDetails) {
      setCompanyDetails(newCompanyDetails);
      // Update current plan's business name with the new company name
      setPlan(prevPlan => prevPlan ? { ...prevPlan, businessName: newCompanyDetails.name } : null);
    }
    // Automatically trigger print after successful login/registration
    executePrint();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCompanyDetails(null);
    localStorage.removeItem('user_email');
    localStorage.removeItem('company_details');
  };


  if (!plan) {
    return <HomePage onSelectBusinessType={handleSelectBusinessType} />;
  }
  
  const currentFinancialSummary = financialSummaries[activeYearIndex];
  const currentYearData = plan.years[activeYearIndex];

  return (
    <>
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {printElement && ReactDOM.createPortal(
        <PrintSummary plan={plan} summaries={financialSummaries} companyDetails={companyDetails} />,
        printElement
      )}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Header 
            onStartOver={handleStartOver} 
            onPrint={handlePrint}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
          />
          
          <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {plan.years.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveYearIndex(index)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeYearIndex === index
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  Year {index + 1}
                </button>
              ))}
              <button
                  onClick={handleAddYear}
                  className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
                >
                  + Add Year
                </button>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
            <div className="lg:col-span-3">
              <BusinessPlanForm 
                plan={plan}
                yearData={currentYearData}
                yearIndex={activeYearIndex}
                setPlan={setPlan} 
                businessType={plan.businessType} 
              />
            </div>

            <div className="lg:col-span-2 space-y-8">
              {currentFinancialSummary && <FinancialSummary summary={currentFinancialSummary} />}
              <GeminiSuggestions suggestions={suggestions} isLoading={isLoading} />
            </div>
          </div>

          <div className="mt-8 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl sticky bottom-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-0">Ready for your strategic plan? Click the button to get insights.</p>
                  <Button 
                      onClick={handleGetSuggestions} 
                      isLoading={isLoading}
                      disabled={isLoading || financialSummaries.some(s => s.totalRevenue <= 0)}
                  >
                      {isLoading ? 'Analyzing...' : 'Get Suggestions'}
                  </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;