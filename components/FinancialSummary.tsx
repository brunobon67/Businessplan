import React from 'react';
import { Card } from './ui/Card';
import { FinancialSummaryData } from '../types';

interface FinancialSummaryProps {
  summary: FinancialSummaryData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const Metric: React.FC<{ label: string; value: string; colorClass?: string; tooltip?: string }> = ({ label, value, colorClass = 'text-gray-900 dark:text-white', tooltip }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400" title={tooltip}>{label}</span>
    <span className={`text-sm font-semibold ${colorClass}`}>{value}</span>
  </div>
);

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const { totalRevenue, totalFixedCosts, totalVariableCosts, grossProfit, netProfit, grossMargin, netMargin, breakEvenUnits } = summary;

  const profitLossColor = netProfit >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <Card className="h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Financial Summary</h2>
      <div className="space-y-2">
        <Metric label="Total Revenue" value={formatCurrency(totalRevenue)} tooltip="Total income from sales." />
        <Metric label="Total Variable Costs" value={formatCurrency(totalVariableCosts)} tooltip="Costs that change directly with the number of units sold."/>
        <Metric label="Gross Profit" value={formatCurrency(grossProfit)} tooltip="Revenue minus Variable Costs."/>
        <Metric label="Gross Margin" value={`${grossMargin.toFixed(1)}%`} tooltip="(Gross Profit / Total Revenue) * 100" />
        <Metric label="Total Fixed Costs" value={formatCurrency(totalFixedCosts)} tooltip="Costs that remain constant regardless of sales volume." />
        <Metric label="Net Profit / Loss" value={formatCurrency(netProfit)} colorClass={profitLossColor} tooltip="Gross Profit minus Fixed Costs." />
        <Metric label="Net Margin" value={`${netMargin.toFixed(1)}%`} colorClass={profitLossColor} tooltip="(Net Profit / Total Revenue) * 100" />
        <Metric label="Break-Even Point" value={`${breakEvenUnits.toFixed(0)} units`} tooltip="Number of units to sell to cover all costs."/>
      </div>
    </Card>
  );
};