import { Banner } from "@shopify/polaris";

export const UpgradeBanner = ({
  currentPlan,
  featureKey,
  count,
  action = {
    content: "Upgrade plan",
    onAction: () => {},
  },
  title = "Upgrade required",
  noun,
}) => {
  const planFeature = currentPlan?.features?.[featureKey];
  const upgradeRequired =
    (planFeature?.type === "limit" && planFeature?.value >= 0 && count > planFeature?.value) ||
    (planFeature?.type === "boolean" && planFeature?.value === false);

  if (!upgradeRequired) {
    return null;
  }

  return (
    <Banner title={title} status="warning" action={action}>
      {planFeature.type === "limit"
        ? `You have reached the limit of ${planFeature?.value} ${(
            noun || planFeature?.name
          ).toLowerCase()}s for your current plan. Please upgrade to continue.`
        : `Your current plan does not support the ${(
            noun || planFeature?.name
          ).toLowerCase()} feature. Please upgrade to continue.`}
    </Banner>
  );
};
