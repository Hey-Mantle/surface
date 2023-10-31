import { Modal, Text } from "@shopify/polaris";

export const UpgradeModal = ({
  currentPlan,
  featureKey,
  count,
  primaryAction = {
    content: "Select plan",
    onAction: () => {},
  },
  title = "Upgrade required",
  onClose,
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
    <Modal
      title={title}
      open={upgradeRequired}
      onClose={onClose}
      sectioned
      primaryAction={primaryAction}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Text>
        {planFeature.type === "limit"
          ? `You have reached the limit of ${planFeature?.value} ${(
              noun || planFeature?.name
            ).toLowerCase()}s for your current plan. Please upgrade to continue.`
          : `Your current plan does not support the ${(
              noun || planFeature?.name
            ).toLowerCase()} feature. Please upgrade to continue.`}
      </Text>
    </Modal>
  );
};
