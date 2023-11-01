import { BlockStack, Page, Spinner, Text } from "@shopify/polaris";
import { useMantle } from "..";
import { PlanGrid } from "../components";

export const AuthenticatedPage = () => {
  const { plans, currentPlan, error, loading } = useMantle();

  return (
    <Page title="Authenticated Page" fullWidth>
      <BlockStack align="center" inlineAlign="center">
        {loading && <Spinner />}
        {!loading && (error || plans?.length == 0) && (
          <Text tone="critical">appId and customerApiToken are required</Text>
        )}
        {!loading && !error && <PlanGrid plans={plans} currentPlan={currentPlan} />}
      </BlockStack>
    </Page>
  );
};
