import { Box, Button, Divider, InlineStack, Text, BlockStack } from "@shopify/polaris";
import { PlanCardHeader } from "../PlanCard";
import { PlanFeatureListItem } from "../PlanFeatureListItem";
import { featureSort } from "../../utils";

export const SubscriptionCard = ({
  subscription,
  subscribeAction = {
    content: "Select plan",
    primary: true,
    onAction: () => {},
    loading: false,
    disabled: false,
  },
  changePlanAction = {
    content: "Change plan",
    primary: true,
    onAction: () => {},
    loading: false,
    disabled: false,
  },
  cancelAction = {
    content: "Cancel subscription",
    primary: false,
    onAction: () => {},
    destructive: true,
    loading: false,
    disabled: false,
  },
}) => (
  <Box padding="5" background="bg" borderRadius="2" shadow="sm">
    <BlockStack gap="4">
      <Text variant="headingMd">Current subscription</Text>
      <Divider />
      {!subscription ? (
        <InlineStack wrap={false} blockAlign="center" align="space-between">
          <Text>You are not currently subscribed to a plan.</Text>
          <Button
            primary={subscribeAction.primary}
            onClick={subscribeAction.onAction}
            disabled={subscribeAction.disabled}
            loading={subscribeAction.loading}
          >
            {subscribeAction.content}
          </Button>
        </InlineStack>
      ) : (
        <BlockStack gap="4">
          <InlineStack wrap={false} align="space-between" blockAlign="start">
            <PlanCardHeader plan={subscription.plan} hasUsageCharges showTrialBadge={false} />

            <Box width="50%">
              {Object.keys(subscription.features).length > 0 && (
                <BlockStack gap="2">
                  {Object.values(subscription.features)
                    .sort(featureSort)
                    .map((feature) => (
                      <PlanFeatureListItem key={feature.id} feature={feature} />
                    ))}
                </BlockStack>
              )}
            </Box>
          </InlineStack>

          <InlineStack align="end" gap="2">
            <Button
              primary={cancelAction.primary}
              destructive={cancelAction.destructive}
              onClick={cancelAction.onAction}
              disabled={cancelAction.disabled}
              loading={cancelAction.loading}
            >
              {cancelAction.content}
            </Button>
            <Button
              primary={changePlanAction.primary}
              onClick={changePlanAction.onAction}
              disabled={changePlanAction.disabled}
              loading={changePlanAction.loading}
            >
              {changePlanAction.content}
            </Button>
          </InlineStack>
        </BlockStack>
      )}
    </BlockStack>
  </Box>
);
