import { Box, HorizontalStack, Icon, Text } from "@shopify/polaris";
import { CircleCancelMinor, CircleTickMinor } from "@shopify/polaris-icons";
import { featureEnabled } from "../../utils";

export const PlanFeatureListItem = ({ feature }) => (
  <HorizontalStack gap="2" align="start" wrap={false} blockAlign="start">
    <Box>
      <Icon
        source={featureEnabled(feature) ? CircleTickMinor : CircleCancelMinor}
        color={featureEnabled(feature) ? "success" : "subdued"}
      />
    </Box>
    <Box width="100%">
      <Text>
        {feature.name}
        {feature.type === "limit"
          ? `: ${feature.value < 0 ? "unlimited" : `up to ${feature.value}`}`
          : ""}
      </Text>
    </Box>
  </HorizontalStack>
);
