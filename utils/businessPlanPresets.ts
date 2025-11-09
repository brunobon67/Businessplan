import { BusinessPlan, BusinessType } from '../types.ts';

const emptyYear = {
  revenueStreams: [],
  fixedCosts: [],
  variableCosts: [],
};

export const businessPlanPresets: Record<BusinessType, BusinessPlan> = {
  retail: {
    businessName: 'Artisan Coffee Roasters',
    businessType: 'retail',
    years: [{
      revenueStreams: [
        { id: '1', name: 'Roasted Coffee Beans (Bags)', pricePerUnit: 20, unitsPerYear: 3000 },
        { id: '2', name: 'In-Store Coffee Sales', pricePerUnit: 5, unitsPerYear: 14400 },
      ],
      fixedCosts: [
        { id: '1', name: 'Rent & Utilities', amount: 30000 },
        { id: '2', name: 'Salaries', amount: 72000 },
        { id: '3', name: 'Marketing', amount: 6000 },
      ],
      variableCosts: [
        { id: '1', name: 'Raw Coffee Beans (per unit)', amount: 8 },
        { id: '2', name: 'Cups, Lids, etc (per unit)', amount: 0.50 },
      ],
    }],
  },
  ecommerce: {
    businessName: 'Online T-Shirt Store',
    businessType: 'ecommerce',
    years: [{
      revenueStreams: [
        { id: '1', name: 'Graphic Tee', pricePerUnit: 25, unitsPerYear: 2400 },
        { id: '2', name: 'Hoodie', pricePerUnit: 45, unitsPerYear: 1200 },
      ],
      fixedCosts: [
        { id: '1', name: 'Shopify Plan', amount: 948 },
        { id: '2', name: 'Marketing (Ads)', amount: 12000 },
        { id: '3', name: 'Plugin Subscriptions', amount: 600 },
      ],
      variableCosts: [
        { id: '1', name: 'T-Shirt Cost', amount: 10 },
        { id: '2', name: 'Shipping & Handling', amount: 5 },
        { id: '3', name: 'Transaction Fees', amount: 1.5 },
      ],
    }],
  },
  consulting: {
    businessName: 'Management Consulting Firm',
    businessType: 'consulting',
    years: [{
      consultingDetails: {
        annualHoursPerConsultant: 2080,
      },
      revenueStreams: [
        { id: '1', name: 'Senior Consultant', hourlyRate: 150, billablePercentage: 80 },
        { id: '2', name: 'Junior Consultant', hourlyRate: 90, billablePercentage: 90 },
        { id: '3', name: 'Digital Product Sales', pricePerUnit: 499, unitsPerYear: 100 },
      ],
      fixedCosts: [
        { id: '1', name: 'CRM Software', amount: 1200 },
        { id: '2', name: 'Professional Insurance', amount: 2400 },
        { id: '3', name: 'Marketing & Advertising', amount: 6000 },
      ],
      variableCosts: [
          { id: '1', name: 'Project Software (per billable hour)', amount: 5 },
      ],
    }],
  },
  saas: {
    businessName: 'SaaS Productivity App',
    businessType: 'saas',
    years: [{
      revenueStreams: [
        { id: '1', name: 'Basic Plan Subscription', pricePerUnit: 120, unitsPerYear: 500 },
        { id: '2', name: 'Pro Plan Subscription', pricePerUnit: 300, unitsPerYear: 150 },
      ],
      fixedCosts: [
        { id: '1', name: 'Server Hosting (Cloud)', amount: 12000 },
        { id: '2', name: 'Developer Salaries', amount: 180000 },
        { id: '3', name: 'Marketing & Sales', amount: 36000 },
      ],
      variableCosts: [
        { id: '1', name: 'Payment Processing (per sub/yr)', amount: 6 },
        { id: '2', name: 'Customer Support (per sub/yr)', amount: 12 },
      ],
    }],
  },
  real_estate: {
    businessName: 'Real Estate Rentals',
    businessType: 'real_estate',
    years: [{
      revenueStreams: [
        { id: '1', name: 'Property 1 Rent', pricePerUnit: 24000, unitsPerYear: 1 },
        { id: '2', name: 'Property 2 Rent', pricePerUnit: 18000, unitsPerYear: 1 },
      ],
      fixedCosts: [
        { id: '1', name: 'Mortgage Payments', amount: 26400 },
        { id: '2', name: 'Property Tax', amount: 4800 },
        { id: '3', 'name': 'Homeowners Insurance', amount: 1800 },
        { id: '4', name: 'Maintenance Fund', amount: 3000 },
      ],
      variableCosts: [],
    }],
  },
  freelance_creator: {
    businessName: 'YouTube Channel & Digital Products',
    businessType: 'freelance_creator',
    years: [{
      revenueStreams: [
          { id: '1', name: 'Patreon Subscribers', pricePerUnit: 96, unitsPerYear: 150 },
          { id: '2', name: 'Digital Guide Sales', pricePerUnit: 29, unitsPerYear: 600 },
          { id: '3', name: 'Ad Revenue', pricePerUnit: 12000, unitsPerYear: 1 },
      ],
      fixedCosts: [
          { id: '1', name: 'Video Editing Software', amount: 600 },
          { id: '2', name: 'Web Hosting', amount: 300 },
          { id: '3', name: 'Stock Music Subscription', amount: 360 },
      ],
      variableCosts: [
          { id: '1', name: 'Payment Processing Fee (per sale/sub)', amount: 1.5 },
      ],
    }],
  },
  custom: {
    businessName: 'My New Business Idea',
    businessType: 'custom',
    years: [{
      ...emptyYear,
      revenueStreams: [{ id: Date.now().toString(), name: '', pricePerUnit: 0, unitsPerYear: 0 }],
      fixedCosts: [{ id: Date.now().toString(), name: '', amount: 0 }],
      variableCosts: [{ id: Date.now().toString(), name: '', amount: 0 }],
    }],
  }
};