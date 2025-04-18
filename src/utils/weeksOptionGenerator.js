
export function generateWeekOptions(numberOfWeeks) {
    if (typeof numberOfWeeks !== 'number' || numberOfWeeks < 2) {
      throw new Error('numberOfWeeks must be a number greater than or equal to 2');
    }
  
    const options = [];
    for (let i = 2; i <= numberOfWeeks; i++) {
      options.push({
        label: `${i} Weeks`,
        value: i
      });
    }
  
    return options;
  }
  
  