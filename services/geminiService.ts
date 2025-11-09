import { GoogleGenAI } from "@google/genai";
import { BusinessPlan, FinancialSummaryData, YearlyFinancials } from '../types';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatYearlyData = (yearData: YearlyFinancials, summary: FinancialSummaryData, yearIndex: number): string => {
  let revenueDetails: string;
  if (yearData.consultingDetails) {
    const billableStreams = yearData.revenueStreams.filter(r => r.hourlyRate !== undefined);
    const nonBillableStreams = yearData.revenueStreams.filter(r => r.pricePerUnit !== undefined);
    
    const billableDetails = billableStreams.map(r => {
      const revenue = (yearData.consultingDetails?.annualHoursPerConsultant || 0) * (r.billablePercentage || 0) / 100 * (r.hourlyRate || 0);
      return `- ${r.name}: ${r.billablePercentage}% billable at ${formatCurrency(r.hourlyRate || 0)}/hr = ${formatCurrency(revenue)}/year`;
    }).join('\n');

    const nonBillableDetails = nonBillableStreams.map(r => `- ${r.name}: ${r.unitsPerYear || 0} units at ${formatCurrency(r.pricePerUnit || 0)} each = ${formatCurrency((r.unitsPerYear || 0) * (r.pricePerUnit || 0))}`).join('\n');

    revenueDetails = '';
    if (billableDetails) {
        revenueDetails += `**Billable Revenue:**\n${billableDetails}`;
    }
    if (nonBillableDetails) {
        revenueDetails += `\n\n**Other Revenue Streams:**\n${nonBillableDetails}`;
    }

  } else {
    revenueDetails = yearData.revenueStreams.map(r => `- ${r.name}: ${r.unitsPerYear || 0} units at ${formatCurrency(r.pricePerUnit || 0)} each = ${formatCurrency((r.unitsPerYear || 0) * (r.pricePerUnit || 0))}`).join('\n');
  }
  
  const fixedCostDetails = yearData.fixedCosts.map(c => `- ${c.name}: ${formatCurrency(c.amount)}`).join('\n');
  const variableCostDetails = yearData.variableCosts.map(c => `- ${c.name}: ${formatCurrency(c.amount)} per unit`).join('\n');

  return `
---
### Year ${yearIndex + 1} Financials

**Revenue Streams:**
${revenueDetails || 'No revenue streams provided.'}

**Fixed Costs:**
${fixedCostDetails || 'No fixed costs provided.'}

**Variable Costs (per unit sold):**
${variableCostDetails || 'No variable costs provided.'}

**Calculated Financial Summary:**
- Total Revenue: ${formatCurrency(summary.totalRevenue)}
- Gross Profit: ${formatCurrency(summary.grossProfit)}
- Net Profit/Loss: ${formatCurrency(summary.netProfit)}
- Gross Margin: ${summary.grossMargin.toFixed(2)}%
- Net Margin: ${summary.netMargin.toFixed(2)}%
- Break-Even Point: ${summary.breakEvenUnits.toFixed(2)} units
`;
};

const buildPrompt = (plan: BusinessPlan, summaries: FinancialSummaryData[]): string => {
  const yearlyBreakdowns = plan.years.map((year, index) => formatYearlyData(year, summaries[index], index)).join('\n');

  return `
You are an expert business consultant. Analyze the following multi-year business plan and provide actionable advice.

**Business Idea:**
${plan.businessName || 'Not specified'}

**Multi-Year Financial Data:**
${yearlyBreakdowns}

---
**Your Task:**
1.  **Overall Viability & Trajectory:** Briefly assess the overall financial viability of this plan over the forecasted period. Is it profitable? What is the year-over-year growth trajectory (revenue, profit, margins)?
2.  **Strengths:** Identify 2-3 key strengths of this business model based on the multi-year data (e.g., improving margins, scalable revenue, decreasing break-even point over time).
3.  **Potential Risks & Weaknesses:** Identify 2-3 potential risks or weaknesses that emerge from the forecast (e.g., stagnant growth, high dependency on a single revenue stream, escalating costs).
4.  **Actionable Suggestions for Long-Term Growth:** Provide 3-5 concrete, actionable suggestions for improvement, focusing on the long-term strategy. How can they improve their year-over-year performance? Suggest new revenue streams for Year 2 or 3, cost-saving measures, or strategic pivots.
5.  **Most Critical Focus Area:** Based on your analysis of the entire forecast, what is the single most critical area the business owner should focus on right now to ensure long-term success?

Please format your response using Markdown for clear readability. Use headings, bullet points, and bold text.
  `;
};

export const generateBusinessPlanAnalysis = async (plan: BusinessPlan, summaries: FinancialSummaryData[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = buildPrompt(plan, summaries);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating business plan analysis:", error);
    return "An error occurred while analyzing the business plan. Please check your API key and try again.";
  }
};