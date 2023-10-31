import { Box, Button, Divider, InlineStack, Text, BlockStack, InlineGrid } from "@shopify/polaris";
import { PlanCardHeader } from "../PlanCard";
import { PlanFeatureListItem } from "../PlanFeatureListItem";
import { featureSort } from "../../utils";

/**
 * @typedef MantleButtonAction
 * @property {string} content
 * @property {boolean} [primary]
 * @property {boolean} [destructive]
 * @property {boolean} [loading]
 * @property {boolean} [disabled]
 * @property {Function} onAction
 */

/**
 * A settings card for showing your currently active plan, if any
 * @param {Object} params
 * @param {import('../MantleProvider/types').Subscription} params.subscription
 * @param {MantleButtonAction} params.subscribeAction
 * @param {MantleButtonAction} params.changePlanAction
 * @param {MantleButtonAction} params.cancelAction
 * @returns {JSX.Element} the subscription card
 */
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
  <Box padding="500" background="bg-fill" borderRadius="200" shadow="200">
    <BlockStack gap="400">
      <Text variant="headingMd">Current subscription</Text>
      <Divider />
      {!subscription ? (
        <InlineStack wrap={false} blockAlign="center" align="space-between" gap="800">
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
        <BlockStack gap="400">
          <InlineGrid columns={{ xs: 1, md: 2 }} gap="2000">
            <PlanCardHeader plan={subscription.plan} hasUsageCharges showTrialBadge={false} />

            {Object.keys(subscription.features).length > 0 && (
              <BlockStack gap="200">
                {Object.values(subscription.features)
                  .sort(featureSort)
                  .map((feature) => (
                    <PlanFeatureListItem key={feature.id} feature={feature} />
                  ))}
              </BlockStack>
            )}
          </InlineGrid>

          <InlineStack align="end" gap="200">
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
