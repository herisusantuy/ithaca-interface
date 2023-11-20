export const formatDate = (inputDate: Date | undefined): string => {
  if (!inputDate) {
    return '';
  }
  const day = inputDate.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat('en', { month: 'short' }).format(inputDate);
  const year = inputDate.getFullYear() % 100;

  // Pad the day with a leading zero if it's a single-digit day
  const formattedDay = day;

  return `${formattedDay}${monthAbbreviation}${year}`;
};
