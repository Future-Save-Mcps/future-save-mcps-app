
export function calculatePercentage(part, total) {
    // Check if inputs are valid numbers
    if (typeof part !== 'number' || typeof total !== 'number') {
      throw new Error('Both inputs must be numbers');
    }
  
    // Check if total is zero
    if (total === 0) {
      throw new Error('Total cannot be zero');
    }
  
    // Calculate percentage
    const percentage = (part / total) * 100;
  
    // Round to two decimal places
    return Math.round(percentage * 100) / 100;
  }
 
  export function formatPercentage(percentage) {
    return `${percentage}%`;
  }
  
  