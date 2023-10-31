import { Box, Button, Divider, BlockStack } from "@shopify/polaris";
import { useState } from "react";
import { featureSort } from "../../utils";
import { PlanFeatureListItem } from "../PlanFeatureListItem";
import { PlanCardHeader } from ".";

/**
 * Simple card for display plan details
 * @param {Object} params
 * @param {import('../MantleProvider/types').Plan} params.plan
 * @param {Function} params.onSubscribe
 * @param {boolean} [params.selected]
 * @returns {JSX.Element} the plan card
 */
export const PlanCard = ({ plan, selected = false, onSubscribe }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Box background="bg-fill" borderRadius="200" shadow="200" padding="500" minWidth="250px">
      <BlockStack gap="400" align="space-between">
        <BlockStack gap="400">
          <PlanCardHeader plan={plan} />
          <Divider borderColor="border" />
          <BlockStack gap="100">
            {Object.values(plan.features)
              .sort(featureSort)
              .map((feature) => (
                <PlanFeatureListItem key={feature.id} feature={feature} />
              ))}
          </BlockStack>
        </BlockStack>

        <Button
          primary
          loading={loading}
          disabled={selected}
          onClick={async () => {
            setLoading(true);
            if (onSubscribe) {
              await onSubscribe(plan);
            }
            setLoading(false);
          }}
        >
          {selected ? "Current plan" : "Select plan"}
        </Button>
      </BlockStack>
    </Box>
  );
};
