import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Divider, BlockStack } from "@shopify/polaris";
import { useState } from "react";
import { featureSort } from "../../utils";
import { PlanFeatureListItem } from "../PlanFeatureListItem";
import { PlanCardHeader } from ".";

export const PlanCard = ({ plan, selected = false, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <Box padding="5" background="bg" borderRadius="2" shadow="sm">
      <BlockStack gap="4" align="space-between">
        <BlockStack gap="4">
          <PlanCardHeader plan={plan} />
          <Divider />
          <BlockStack gap="1">
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
