import { BlockStack, InlineStack, Text, Badge } from "@shopify/polaris";
import { intervalLabelShort, money } from "../../utils";

export const PlanCardHeader = ({ plan }) => {
  const hasUsageCharges = !!plan.usageCharges ? Object.keys(plan.usageCharges).length > 0 : false;
  const hasTrial = plan.trialDays > 0;

  return (
    <BlockStack gap="200">
      <BlockStack gap="100">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" color="subdued">
            {plan.name}
          </Text>
          {hasTrial && <Badge status="success">{plan.trialDays} day free trial!</Badge>}
        </InlineStack>
        <InlineStack blockAlign="end" align="start">
          <Text variant="headingXl">
            {money({ amount: plan.subtotal, currency: plan.currencyCode })}
          </Text>
          {plan.subtotal > 0 && <Text variant="bodySm">/{intervalLabelShort(plan.interval)}</Text>}
        </InlineStack>
      </BlockStack>
      {hasUsageCharges && (
        <Text variant="bodySm" color="subdued">
          +{" "}
          {Object.values(plan.usageCharges)
            .map((charge) => charge.terms)
            .join(", ")}
        </Text>
      )}
    </BlockStack>
  );
};
