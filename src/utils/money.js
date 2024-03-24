const moneyFormatter = (currencyCode = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    notation: "standard",
  });

/**
 * Formats the given amount of money based on the specified currency code.
 * @param {number} amount - The amount of money to format.
 * @param {string} [currencyCode="USD"] - The currency code to use for formatting. Defaults to "USD".
 * @param {boolean} [removeCents=true] - Specifies whether to remove the cents from the formatted result. Defaults to true.
 * @returns {string} The formatted money string.
 */
export const money = (amount, currencyCode = "USD", removeCents = true) => {
  let result = moneyFormatter(currencyCode).format(amount);
  if (removeCents) {
    result = result.replace(/\.00$/, '');
  }
  return result;
}
