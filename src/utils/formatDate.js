export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth() returns 0-11
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
  
  };