/**
 * Get the column span for the grid layout
 * @param {number} count - The number of columns
 * @returns {Object.<string, number>} The column span for each screen size
 */
export const columnSpan = (count = 4) => {
  if (count % 4 === 0) return { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 };
  if (count % 3 === 0) return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
  if (count % 2 === 0) return { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 };
  if (count === 1) return { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 };
  return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
};

/**
 * Get the column count for the grid layout
 * @param {number} size - The number of items
 * @returns {number} The number of columns
 */
export const columnCount = (size = 4) => {
  if (size % 4 === 0) return 4;
  if (size % 3 === 0) return 3;
  if (size % 2 === 0) return 2;
  if (size === 1) return 1;
  return 4;
};
