export const formatDate = (date) => {
  const dateObj = new Date(Number(date) * 1000);
  return dateObj.toISOString();
};
