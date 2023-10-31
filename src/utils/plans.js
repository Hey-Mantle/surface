export const intervalLabel = (interval) => {
  switch (interval) {
    case "ANNUAL":
      return "yearly";
    case "EVERY_30_DAYS":
    default:
      return "monthly";
  }
};

export const intervalLabelShort = (interval) => {
  switch (interval) {
    case "ANNUAL":
      return "yr";
    case "EVERY_30_DAYS":
    default:
      return "mo";
  }
};
