export type BusinessType = 'consulting' | 'real_estate' | 'retail' | 'saas' | 'ecommerce' | 'freelance_creator' | 'custom';

export interface CostItem {
  id: string;
  name: string;
  amount: number;
}

export interface RevenueStream {
  id: string;
  name: string;
  
  // For standard models
  pricePerUnit?: number;
  unitsPerYear?: number;
  
  // For consulting model
  hourlyRate?: number;
  billablePercentage?: number;
}

export interface YearlyFinancials {
  revenueStreams: RevenueStream[];
  fixedCosts: CostItem[];
  variableCosts: CostItem[];
  consultingDetails?: {
    annualHoursPerConsultant: number;
  };
}

export interface BusinessPlan {
  businessName: string;
  businessType: BusinessType;
  years: YearlyFinancials[];
}

export interface CompanyDetails {
  name: string;
  address: string;
  slogan: string;
  logo: string; // Base64 encoded image
}

export interface FinancialSummaryData {
  totalRevenue: number;
  totalFixedCosts: number;
  totalVariableCosts: number;
  totalUnits: number;
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  breakEvenUnits: number;
}
