import { Box, InlineStack, Icon, Text } from "@shopify/polaris";
import { CircleCancelMinor, CircleTickMinor } from "@shopify/polaris-icons";
import { featureEnabled } from "../../utils";

export const PlanFeatureListItem = ({ feature }) => (
  <InlineStack gap="200" align="start" wrap={false} blockAlign="center">
    <Box>
      <Icon
        source={featureEnabled(feature) ? CircleTickMinor : CircleCancelMinor}
        color={featureEnabled(feature) ? "success" : "subdued"}
      />
    </Box>
    <Box width="100%">
      <Text>
        {feature.name}
        {feature.type === "limit" && featureEnabled(feature)
          ? `: ${feature.value < 0 ? "unlimited" : `up to ${feature.value}`}`
          : ""}
      </Text>
    </Box>
  </InlineStack>
);
