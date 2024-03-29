import React from "react";
import { CheckIcon, PlusIcon } from "@shopify/polaris-icons";
import { Badge, Box, BlockStack, Button, InlineStack, Icon, Text } from "@shopify/polaris";
import { Labels, intervalLabel, money } from "../../../../utils";

/**
 * @typedef {import('@heymantle/client').Plan} Plan
 * @typedef {import('@heymantle/client').Discount} Discount
 */

/**
 * Title section component for HoritzontalPlanCard.
 * @component
 * @param {Object} props
 * @param {Plan} props.plan - The Mantle Plan object.
 * @returns {JSX.Element}
 */
export const PlanTitleSection = ({ plan }) => (
  <BlockStack gap="100">
    <Text variant="headingMd" alignment="center">
      {plan.name}
    </Text>
    {plan.description && (
      <Text variant="bodyLg" tone="subdued" alignment="center">
        {plan.description}
      </Text>
    )}
  </BlockStack>
);

/**
 * Pricing section component for HoritzontalPlanCard.
 * @param {Object} props
 * @param {Plan} props.plan - The Mantle Plan object.
 * @param {Discount} props.discount - The Mantle Discount object.
 * @param {boolean} [props.useShortFormPlanIntervals] - Whether to use short form plan intervals.
 * @returns {JSX.Element}
 */
export const PlanPricingSection = ({ plan, discount, useShortFormPlanIntervals = true }) => (
  <BlockStack gap="100">
    {!!discount && (
      <InlineStack align="center" blockAlign="center" gap="200">
        <Text variant="heading3xl">{money(discountedAmount, plan.currency, true)}</Text>
        <Text
          variant="heading3xl"
          tone="subdued"
          fontWeight="medium"
          textDecorationLine="line-through"
        >
          {money(plan.amount, plan.currency, true)}
        </Text>
        <Text variant="bodyLg" tone="subdued">
          {Labels.Per} {intervalLabel({ interval: plan.interval, useShortFormPlanIntervals })}
        </Text>
      </InlineStack>
    )}
    {!discount && (
      <InlineStack align="center" blockAlign="center" gap="200">
        <Text alignment="center" variant="heading3xl">
          {money(plan.amount, plan.currency, true)}
        </Text>
        <Text alignment="center" variant="bodyLg" tone="subdued">
          {Labels.Per} {intervalLabel({ interval: plan.interval, useShortFormPlanIntervals })}
        </Text>
      </InlineStack>
    )}
    {plan.usageCharges.length > 0 && (
      <BlockStack>
        {plan.usageCharges.map((usageCharge, index) => {
          return (
            <InlineStack key={`plan-usageCharge-${index}`} align="center" gap="100">
              <Box>
                <Icon source={PlusIcon} tone="positive" />
              </Box>
              <Text variant="bodyLg">{usageCharge.terms}</Text>
            </InlineStack>
          );
        })}
      </BlockStack>
    )}
  </BlockStack>
);

/**
 * Features section component for HoritzontalPlanCard.
 * @param {Object} props
 * @param {Plan} props.plan - The Mantle Plan object.
 * @param {boolean} [props.trialDaysAsFeature] - Whether to show the trial days as a feature.
 * @returns {JSX.Element}
 */
export const PlanFeaturesSection = ({ plan, trialDaysAsFeature = false }) => (
  <BlockStack gap="300">
    {trialDaysAsFeature && plan.trialDays && plan.trialDays > 0 ? (
      <InlineStack align="center" blockAlign="center" gap="100">
        <Box>
          <Icon source={CheckIcon} tone="positive" />
        </Box>
        <Text tone="subdued">
          {Labels.FreeTrialLength.replace("{{ trialDays }}", plan.trialDays)}
        </Text>
      </InlineStack>
    ) : null}
    {plan.featuresOrder.map((feature, index) => {
      const planFeature = plan.features[feature];
      const showFeature = planFeature.type !== "boolean" || planFeature.value === true;
      if (showFeature) {
        return (
          <InlineStack key={`plan-feature-${index}`} align="center" gap="100">
            <Box>
              <Icon source={CheckIcon} tone="positive" />
            </Box>
            {planFeature.type === "boolean" ? (
              <Text tone="subdued">{planFeature.name}</Text>
            ) : (
              <Text tone="subdued">
                {planFeature.value} {planFeature.name}
              </Text>
            )}
          </InlineStack>
        );
      }
    })}
  </BlockStack>
);

/**
 * Highlighted plan card component.
 * @param {Object} props
 * @param {Plan} props.plan - The Mantle Plan object.
 * @param {Discount} props.discount - The Mantle Discount object.
 * @param {string} [props.buttonLabel] - The label for the button.
 * @param {({ plan: Plan, discount: Discount }) => void} [props.onSelectPlan] - The callback for selecting a plan.
 * @param {boolean} [props.useShortFormPlanIntervals] - Whether to use short form plan intervals.
 * @param {boolean} [props.trialDaysAsFeature] - Whether to show the trial days as a feature.
 * @param {boolean} [props.expanded] - Whether the card is expanded to match recommended plans.
 * @param {boolean} [props.isRecommendedPlan] - Whether the plan is recommended. Shows a badge and expands the card.
 * @param {boolean} [props.isActivePlan] - Whether the plan is the active plan.
 * @param {boolean} [props.isCustomPlan] - Whether the plan is a custom plan.
 * @param {boolean} [props.showRecommendedPlanBadge] - Whether to show the recommended plan badge.
 * @returns {JSX.Element}
 */
export const HighlightedPlanCard = ({
  plan,
  discount,
  buttonLabel,
  onSelectPlan,
  useShortFormPlanIntervals = true,
  trialDaysAsFeature = false,
  expanded = false,
  isActivePlan = false,
  isRecommendedPlan = false,
  isCustomPlan = false,
  showRecommendedPlanBadge = true,
}) => {
  return (
    <Box position="relative" minHeight="100%">
      <Box paddingBlock={expanded || isRecommendedPlan ? undefined : "800"} minHeight="100%">
        <Box
          background={isRecommendedPlan || isCustomPlan ? "bg-surface" : "bg-surface-secondary"}
          borderStyle="solid"
          borderColor="border"
          borderWidth="025"
          paddingBlock={expanded || isRecommendedPlan ? "1600" : "800"}
          paddingInline="400"
          borderRadius="200"
          minHeight={`calc(100% - calc(var(--p-space-800) * 2))`}
        >
          <BlockStack gap="800">
            <BlockStack gap="400">
              <PlanTitleSection plan={plan} />
              <PlanPricingSection
                plan={plan}
                discount={discount}
                useShortFormPlanIntervals={useShortFormPlanIntervals}
              />
            </BlockStack>
            <Button
              size="large"
              variant={isRecommendedPlan ? "primary" : "secondary"}
              onClick={() => {
                if (onSelectPlan) {
                  onSelectPlan({ plan, discount });
                } else {
                  console.log("No onSelectPlan callback provided");
                }
              }}
              disabled={isActivePlan}
            >
              {buttonLabel || Labels.SelectPlan}
            </Button>
            <PlanFeaturesSection plan={plan} trialDaysAsFeature={trialDaysAsFeature} />
            {isRecommendedPlan && showRecommendedPlanBadge && (
              <InlineStack align="center" gap="100">
                <Badge tone="success">{Labels.MostPopular}</Badge>
              </InlineStack>
            )}
          </BlockStack>
        </Box>
      </Box>
    </Box>
  );
};
