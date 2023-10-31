export const featureEnabled = (feature) => {
  return (
    (feature.type === "boolean" && feature.value == true) ||
    (feature.type === "limit" && feature.value !== 0)
  );
};

export const featureSort = (a, b) =>
  featureEnabled(b) - featureEnabled(a) || a.name.localeCompare(b.name);