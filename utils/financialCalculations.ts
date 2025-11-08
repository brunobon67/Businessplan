import { YearlyFinancials, FinancialSummaryData } from '../types';

const calculateTotalRevenue = (year: YearlyFinancials): number => {
  if (year.consultingDetails) {
    // For consulting, sum both billable and non-billable revenue streams.
    return year.revenueStreams.reduce((acc, stream) => {
      let streamRevenue = 0;
      if (stream.hourlyRate !== undefined && stream.billablePercentage !== undefined) {
        const hours = year.consultingDetails?.annualHoursPerConsultant || 0;
        const rate = stream.hourlyRate || 0;
        const percentage = stream.billablePercentage || 0;
        streamRevenue = hours * (percentage / 100) * rate;
      } else if (stream.pricePerUnit !== undefined && stream.unitsPerYear !== undefined) {
        streamRevenue = (stream.pricePerUnit || 0) * (stream.unitsPerYear || 0);
      }
      return acc + streamRevenue;
    }, 0);
  } else {
    // Standard model
    return year.revenueStreams.reduce(
      (acc, stream) => acc + (stream.pricePerUnit || 0) * (stream.unitsPerYear || 0),
      0
    );
  }
};

export const calculateTotalUnits = (year: YearlyFinancials): number => {
  if (year.consultingDetails) {
    // For consulting, 'units' for variable cost calculation are the total billable hours.
    return year.revenueStreams.reduce((acc, stream) => {
      if (stream.billablePercentage !== undefined) {
        const hours = year.consultingDetails?.annualHoursPerConsultant || 0;
        const percentage = stream.billablePercentage || 0;
        return acc + (hours * (percentage / 100));
      }
      return acc;
    }, 0);
  } else {
    return year.revenueStreams.reduce(
      (acc, stream) => acc + (stream.unitsPerYear || 0),
      0
    );
  }
};


export const calculateFinancials = (year: YearlyFinancials): FinancialSummaryData => {
  const totalRevenue = calculateTotalRevenue(year);
  const totalUnits = calculateTotalUnits(year);

  const totalFixedCosts = year.fixedCosts.reduce((acc, cost) => acc + cost.amount, 0);

  const totalVariableCostsPerUnit = year.variableCosts.reduce((acc, cost) => acc + cost.amount, 0);
  const totalVariableCosts = totalVariableCostsPerUnit * totalUnits;

  const grossProfit = totalRevenue - totalVariableCosts;
  const netProfit = grossProfit - totalFixedCosts;

  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  const contributionMarginPerUnit = totalUnits > 0 ? (totalRevenue - totalVariableCosts) / totalUnits : 0;
  const breakEvenUnits = contributionMarginPerUnit > 0 ? totalFixedCosts / contributionMarginPerUnit : Infinity;

  return {
    totalRevenue,
    totalFixedCosts,
    totalVariableCosts,
    totalUnits,
    grossProfit,
    netProfit,
    grossMargin,
    netMargin,
    breakEvenUnits: isFinite(breakEvenUnits) ? breakEvenUnits : 0,
  };
};