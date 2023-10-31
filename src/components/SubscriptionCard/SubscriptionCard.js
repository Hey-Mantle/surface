import { Box, Button, Divider, HorizontalStack, Text, VerticalStack } from "@shopify/polaris";
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
    <VerticalStack gap="4">
      <Text variant="headingMd">Current subscription</Text>
      <Divider />
      {!subscription ? (
        <HorizontalStack wrap={false} blockAlign="center" align="space-between">
          <Text>You are not currently subscribed to a plan.</Text>
          <Button
            primary={subscribeAction.primary}
            onClick={subscribeAction.onAction}
            disabled={subscribeAction.disabled}
            loading={subscribeAction.loading}
          >
            {subscribeAction.content}
          </Button>
        </HorizontalStack>
      ) : (
        <VerticalStack gap="4">
          <HorizontalStack wrap={false} align="space-between" blockAlign="start">
            <PlanCardHeader plan={subscription.plan} hasUsageCharges showTrialBadge={false} />

            <Box width="50%">
              {Object.keys(subscription.features).length > 0 && (
                <VerticalStack gap="2">
                  {Object.values(subscription.features)
                    .sort(featureSort)
                    .map((feature) => (
                      <PlanFeatureListItem key={feature.id} feature={feature} />
                    ))}
                </VerticalStack>
              )}
            </Box>
          </HorizontalStack>

          <HorizontalStack align="end" gap="2">
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
          </HorizontalStack>
        </VerticalStack>
      )}
    </VerticalStack>
  </Box>
);
