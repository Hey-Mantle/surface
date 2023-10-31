import PropTypes from "prop-types";
import { Box, Button, Divider, BlockStack } from "@shopify/polaris";
import { useState } from "react";
import { featureSort } from "../../utils";
import { PlanFeatureListItem } from "../PlanFeatureListItem";
import { PlanCardHeader } from ".";

export const PlanCard = ({ plan, selected = false, onSubscribe }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Box background="bg-fill" borderRadius="200" shadow="200" padding="400" minWidth="200px">
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

PlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSubscribe: PropTypes.func,
};

PlanCard.defaultProps = {
  selected: false,
};
