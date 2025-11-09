import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { CompanyDetails } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (companyDetails?: CompanyDetails) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Registration fields
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companySlogan, setCompanySlogan] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }
    
    if (isLoginView) {
      // Login logic
      const storedUser = localStorage.getItem('user_email');
      if (storedUser === email) {
        const storedCompanyDetails = localStorage.getItem('company_details');
        onLoginSuccess(storedCompanyDetails ? JSON.parse(storedCompanyDetails) : undefined);
      } else {
        setError('No account found with that email.');
      }
    } else {
      // Register logic
      if (!companyName) {
        setError('Please enter your company name.');
        return;
      }
      if (localStorage.getItem('user_email') === email) {
        setError('An account with this email already exists.');
        return;
      }

      let logoBase64 = '';
      if (companyLogo) {
        logoBase64 = await fileToBase64(companyLogo);
      }

      const newCompanyDetails: CompanyDetails = {
        name: companyName,
        address: companyAddress,
        slogan: companySlogan,
        logo: logoBase64,
      };

      localStorage.setItem('user_email', email);
      localStorage.setItem('company_details', JSON.stringify(newCompanyDetails));
      
      onLoginSuccess(newCompanyDetails);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-2">
          {isLoginView ? 'Login to Continue' : 'Create an Account'}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
          You need an account to print your financial summary.
        </p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <Input 
            id="email" 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            id="password" 
            label="Password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLoginView && (
            <>
              <hr className="my-6 border-gray-200 dark:border-gray-700"/>
              <h3 className="text-lg font-semibold text-center">Company Details</h3>
              <Input
                id="companyName"
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <Input
                id="companyAddress"
                label="Company Address (Optional)"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
              <Input
                id="companySlogan"
                label="Company Slogan (Optional)"
                value={companySlogan}
                onChange={(e) => setCompanySlogan(e.target.value)}
              />
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Logo (Optional)</label>
                <div className="flex items-center space-x-4">
                  {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 rounded-lg object-cover" />}
                  <input type="file" id="logo" accept="image/*" onChange={handleLogoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
          <Button type="submit" className="w-full !py-3">
            {isLoginView ? 'Login' : 'Create Account & Print'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-blue-600 hover:underline dark:text-blue-500 ml-1">
            {isLoginView ? 'Register' : 'Login'}
          </button>
        </p>
      </Card>
    </div>
  );
};