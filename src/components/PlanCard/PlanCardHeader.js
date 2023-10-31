import { VerticalStack, HorizontalStack, Text, Badge } from "@shopify/polaris";
import { intervalLabelShort, money } from "../../utils";

export const PlanCardHeader = ({ plan }) => {
  const hasUsageCharges = Object.keys(plan.usageCharges).length > 0;
  const hasTrial = plan.trialDays > 0;

  return (
    <VerticalStack gap="2">
      <VerticalStack gap="1">
        <HorizontalStack align="space-between" blockAlign="center">
          <Text variant="headingMd" color="subdued">
            {plan.name}
          </Text>
          {hasTrial && <Badge status="success">{plan.trialDays} day free trial!</Badge>}
        </HorizontalStack>
        <HorizontalStack blockAlign="end" align="start">
          <Text variant="headingXl">
            {money({ amount: plan.amount, currency: plan.currencyCode })}
          </Text>
          {plan.amount > 0 && <Text variant="bodySm">/{intervalLabelShort(plan.interval)}</Text>}
        </HorizontalStack>
      </VerticalStack>
      {hasUsageCharges ? (
        <Text variant="bodySm" color="subdued">
          +{" "}
          {Object.values(plan.usageCharges)
            .map((charge) => charge.terms)
            .join(", ")}
        </Text>
      ) : (
        <Text variant="bodySm" color="subdued">
          &mdash;
        </Text>
      )}
    </VerticalStack>
  );
};
