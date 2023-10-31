import {
  Box,
  Button,
  Divider,
  VerticalStack,
} from "@shopify/polaris";
import { useState } from "react";
import { PlanFeatureListItem } from "./PlanFeatureListItem";
import { featureSort } from "./utils";

export const PlanCard = ({ plan, currentPlan, hasUsageCharges = false, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const isCurrentPlan = currentPlan.id === plan.id;

  return (
    <Box padding="5" background="bg" borderRadius="2" shadow="sm">
      <VerticalStack gap="4" align="space-between">
        <VerticalStack gap="4">
          <PlanCardHeader plan={plan} hasUsageCharges={hasUsageCharges} />
          <Divider />
          <VerticalStack gap="1">
            {Object.values(plan.features)
              .sort(featureSort)
              .map((feature) => (
                <PlanFeatureListItem key={feature.id} feature={feature} />
              ))}
          </VerticalStack>
        </VerticalStack>

        <Button
          primary
          loading={loading}
          disabled={isCurrentPlan}
          onClick={async () => {
            setLoading(true);
            await onSubscribe(plan);
            setLoading(false);
          }}
        >
          {isCurrentPlan ? "Current plan" : "Select plan"}
        </Button>
      </VerticalStack>
    </Box>
  );
};
