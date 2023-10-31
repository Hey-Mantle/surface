const largeMoneyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
  });

const moneyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "standard",
  });

export const money = ({ amount = 0, currency = "USD" }) => {
  return moneyFormatter(currency).format(amount);
};

export const moneyWithoutCents = ({ amount = 0, currency = "USD" }) => {
  return moneyFormatter(currency).format(amount).replace(/\.00$/, "");
};

export const largeMoney = ({ amount = 0, currency = "USD" }) => {
  return largeMoneyFormatter(currency).format(amount);
};
