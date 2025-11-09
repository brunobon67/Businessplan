import React, { useMemo, useState, useEffect } from 'react';
import { BusinessPlan, BusinessType, CostItem, RevenueStream, YearlyFinancials } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { calculateTotalUnits } from '../utils/financialCalculations';

interface BusinessPlanFormProps {
  plan: BusinessPlan;
  yearData: YearlyFinancials;
  yearIndex: number;
  businessType: BusinessType;
  setPlan: React.Dispatch<React.SetStateAction<BusinessPlan | null>>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const BusinessPlanForm: React.FC<BusinessPlanFormProps> = ({ plan, yearData, yearIndex, businessType, setPlan }) => {
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedItemId) {
      const element = document.getElementById(highlightedItemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedItemId]);
  
  const totalUnits = useMemo(() => calculateTotalUnits(yearData), [yearData]);

  const handleYearlyDataChange = <K extends keyof YearlyFinancials>(key: K, value: YearlyFinancials[K]) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newYears = [...prevPlan.years];
      const newYearData = { ...newYears[yearIndex], [key]: value };
      newYears[yearIndex] = newYearData;
      return { ...prevPlan, years: newYears };
    });
  };

  const handleListChange = (
    listName: 'revenueStreams' | 'fixedCosts' | 'variableCosts',
    itemIndex: number,
    field: keyof RevenueStream | keyof CostItem,
    value: string,
  ) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newYears = [...prevPlan.years];
      const currentYear = { ...newYears[yearIndex] };
      const list = currentYear[listName] as any[];
      const newList = [...list];
      const item = { ...newList[itemIndex] };

      const isNumericField = field !== 'name';
      
      item[field] = isNumericField ? Number(value) || 0 : value;
      newList[itemIndex] = item;
      
      currentYear[listName] = newList;
      newYears[yearIndex] = currentYear;
      return { ...prevPlan, years: newYears };
    });
  };

  const handleAddItem = (
    listName: 'revenueStreams' | 'fixedCosts' | 'variableCosts',
    type?: 'billable' | 'product'
  ) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const id = `${listName}-${Date.now()}`;
      setHighlightedItemId(id);
      
      const newYears = [...prevPlan.years];
      const currentYear = { ...newYears[yearIndex] };

      // FIX: Replaced generic item adding logic with a type-safe switch statement to resolve type errors.
      switch (listName) {
        case 'revenueStreams': {
          let newItem: RevenueStream;
          if (businessType === 'consulting') {
            newItem =
              type === 'billable'
                ? { id, name: 'New Billable Service', hourlyRate: 0, billablePercentage: 0 }
                : { id, name: 'New Product/Service', pricePerUnit: 0, unitsPerYear: 0 };
          } else {
            newItem = { id, name: '', pricePerUnit: 0, unitsPerYear: 0 };
          }
          currentYear.revenueStreams = [...currentYear.revenueStreams, newItem];
          break;
        }
        case 'fixedCosts': {
          const newItem: CostItem = { id, name: '', amount: 0 };
          currentYear.fixedCosts = [...currentYear.fixedCosts, newItem];
          break;
        }
        case 'variableCosts': {
          const newItem: CostItem = { id, name: '', amount: 0 };
          currentYear.variableCosts = [...currentYear.variableCosts, newItem];
          break;
        }
      }
      
      newYears[yearIndex] = currentYear;
      
      return { ...prevPlan, years: newYears };
    });
  };

  const handleRemoveItem = (
    listName: 'revenueStreams' | 'fixedCosts' | 'variableCosts',
    itemIndex: number,
  ) => {
    setPlan(prevPlan => {
      if (!prevPlan) return null;
      const newYears = [...prevPlan.years];
      const currentYear = { ...newYears[yearIndex] };
      const list = currentYear[listName] as (RevenueStream | CostItem)[];
      const newList = list.filter((_, i) => i !== itemIndex);
      currentYear[listName] = newList;
      newYears[yearIndex] = currentYear;
      
      return { ...prevPlan, years: newYears };
    });
  };
  
    if (!yearData) {
    return <Card>Loading year data...</Card>;
  }


  return (
    <div className="space-y-8">
      {yearIndex === 0 && ( // Only show business details on the first year's form
        <Card>
          <h2 className="text-xl font-bold mb-4">Business Details</h2>
          <Input
            id="businessName"
            label="Business Name / Idea"
            placeholder="e.g., Artisan Coffee Roasters"
            value={plan.businessName}
            onChange={e => setPlan(p => p ? {...p, businessName: e.target.value} : null)}
          />
          {businessType === 'consulting' && (
            <div className="mt-4">
              <Input
                id="annualHours"
                label="Annual Hours Per Consultant"
                type="number"
                value={yearData.consultingDetails?.annualHoursPerConsultant || ''}
                onChange={e =>
                  handleYearlyDataChange('consultingDetails', {
                    annualHoursPerConsultant: Number(e.target.value),
                  })
                }
              />
            </div>
          )}
        </Card>
      )}


      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Revenue Streams</h2>
          {businessType === 'consulting' ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => handleAddItem('revenueStreams', 'billable')}>
                + Add Billable
              </Button>
              <Button variant="secondary" onClick={() => handleAddItem('revenueStreams', 'product')}>
                + Add Product
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => handleAddItem('revenueStreams')}>
              + Add Stream
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {yearData.revenueStreams.map((stream, index) => {
            let revenueForStream = 0;
            if (stream.hourlyRate !== undefined) {
              revenueForStream = (yearData.consultingDetails?.annualHoursPerConsultant || 0) * (stream.billablePercentage || 0) / 100 * (stream.hourlyRate || 0);
            } else {
              revenueForStream = (stream.pricePerUnit || 0) * (stream.unitsPerYear || 0);
            }

            return (
              <div key={stream.id} id={stream.id} className={`p-4 border rounded-lg dark:border-gray-700 transition-colors duration-300 ${highlightedItemId === stream.id ? 'new-item-highlight' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      id={`rev-name-${index}`}
                      label="Stream Name"
                      value={stream.name}
                      onChange={e => handleListChange('revenueStreams', index, 'name', e.target.value)}
                    />
                  </div>
                  {stream.hourlyRate !== undefined ? (
                    <>
                      <Input
                        id={`rev-hourly-${index}`}
                        label="Hourly Rate ($)"
                        type="number"
                        value={stream.hourlyRate || ''}
                        onChange={e => handleListChange('revenueStreams', index, 'hourlyRate', e.target.value)}
                      />
                      <Input
                        id={`rev-billable-${index}`}
                        label="Billable %"
                        type="number"
                        value={stream.billablePercentage || ''}
                        onChange={e => handleListChange('revenueStreams', index, 'billablePercentage', e.target.value)}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        id={`rev-price-${index}`}
                        label="Price per Unit ($)"
                        type="number"
                        value={stream.pricePerUnit || ''}
                        onChange={e => handleListChange('revenueStreams', index, 'pricePerUnit', e.target.value)}
                      />
                      <Input
                        id={`rev-units-${index}`}
                        label="Units per Year"
                        type="number"
                        value={stream.unitsPerYear || ''}
                        onChange={e => handleListChange('revenueStreams', index, 'unitsPerYear', e.target.value)}
                      />
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 pt-2 border-t dark:border-gray-600">
                  <Button variant="danger" onClick={() => handleRemoveItem('revenueStreams', index)}>
                    Remove
                  </Button>
                  <p className="text-right text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Est. Annual Revenue: {formatCurrency(revenueForStream)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Annual Fixed Costs</h2>
          <Button variant="secondary" onClick={() => handleAddItem('fixedCosts')}>
            + Add Cost
          </Button>
        </div>
        <div className="space-y-4">
          {yearData.fixedCosts.map((cost, index) => (
            <div key={cost.id} id={cost.id} className={`p-4 border rounded-lg dark:border-gray-700 transition-colors duration-300 ${highlightedItemId === cost.id ? 'new-item-highlight' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <Input
                    id={`fixed-name-${index}`}
                    label="Cost Name"
                    value={cost.name}
                    onChange={e => handleListChange('fixedCosts', index, 'name', e.target.value)}
                  />
                </div>
                <Input
                  id={`fixed-amount-${index}`}
                  label="Annual Amount ($)"
                  type="number"
                  value={cost.amount}
                  onChange={e => handleListChange('fixedCosts', index, 'amount', e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="danger" onClick={() => handleRemoveItem('fixedCosts', index)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Variable Costs (Per Unit)</h2>
          <Button variant="secondary" onClick={() => handleAddItem('variableCosts')}>
            + Add Cost
          </Button>
        </div>
        <div className="space-y-4">
          {yearData.variableCosts.map((cost, index) => {
            const totalCostForLine = (cost.amount || 0) * totalUnits;
            return (
              <div key={cost.id} id={cost.id} className={`p-4 border rounded-lg dark:border-gray-700 transition-colors duration-300 ${highlightedItemId === cost.id ? 'new-item-highlight' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                   <div className="md:col-span-2">
                    <Input
                      id={`var-name-${index}`}
                      label="Cost Name"
                      value={cost.name}
                      onChange={e => handleListChange('variableCosts', index, 'name', e.target.value)}
                    />
                  </div>
                  <Input
                    id={`var-amount-${index}`}
                    label="Amount per Unit ($)"
                    type="number"
                    value={cost.amount}
                    onChange={e => handleListChange('variableCosts', index, 'amount', e.target.value)}
                  />
                </div>
                 <div className="flex justify-between items-center mt-4 pt-2 border-t dark:border-gray-600">
                  <Button variant="danger" onClick={() => handleRemoveItem('variableCosts', index)}>
                    Remove
                  </Button>
                   <p className="text-right text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Est. Annual Cost: {formatCurrency(totalCostForLine)}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                      (for {totalUnits.toFixed(0)} units)
                    </span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  );
};