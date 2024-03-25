import React, { useState } from "react";
import {
  Banner,
  Box,
  BlockStack,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { Labels, PlanInterval } from "../../../../utils";
import { HighlightedPlanCard } from "./HighlightedPlanCard";

export const HighlightedPlanCards = ({
  customer,
  plans,
  onSubscribe,
  backUrl = "", // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge = true, // boolean
  customFieldCta = null, // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended = "Recommended", // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans = false, // boolean
  showPlanIntervalToggle = true, // boolean
  showTrialDaysAsFeature = true, // boolean
  useShortFormPlanIntervals = true, // boolean: e.g. show "$ / mo" instead of "$ / month"
  pageWidth = "default", // string: "full", "narrow", or "default"
  showCustomPlans = true, // boolean: show custom plans
}) => {
  const subscription = customer?.subscription;
  const urlParams = new URLSearchParams(window.location.search);
  const hasMonthlyAndYearlyPlans =
    plans.some((plan) => plan.interval === PlanInterval.ANNUAL) &&
    plans.some((plan) => plan.interval === PlanInterval.EVERY_30_DAYS);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan.id);
  const [planInterval, setPlanInterval] = useState(
    currentPlan
      ? currentPlan.interval
      : hasMonthlyAndYearlyPlans
      ? PlanInterval.ANNUAL
      : PlanInterval.EVERY_30_DAYS
  );
  const availablePlans = plans.filter(
    (plan) => plan.availability !== "customerTag" && plan.availability !== "customer"
  );
  const plansToShow =
    showPlanIntervalToggle && hasMonthlyAndYearlyPlans
      ? availablePlans.filter((plan) => plan.interval === planInterval)
      : availablePlans;
  const customPlans = showCustomPlans
    ? plans.filter(
        (plan) => plan.availability === "customerTag" || plan.availability === "customer"
      )
    : [];
  const [showSuccessBanner, setShowSuccessBanner] = useState(
    urlParams.get("subscribed") === "true"
  );

  const columnSpan = (count = plansToShow.length) => {
    if (count % 4 === 0) return { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 };
    if (count % 3 === 0) return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
    if (count % 2 === 0) return { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 };
    if (count === 1) return { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 };
    return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
  };

  const columnCount = () => {
    if (plansToShow.length % 4 === 0) return 4;
    if (plansToShow.length % 3 === 0) return 3;
    if (plansToShow.length % 2 === 0) return 2;
    if (plansToShow.length === 1) return 1;
    return 4;
  };

  return (
    <Page
      title={Labels.Plans}
      backAction={backUrl && backUrl !== "" ? { content: Labels.Back, url: backUrl } : undefined}
      secondaryActions={
        showPlanIntervalToggle && hasMonthlyAndYearlyPlans ? (
          <ButtonGroup variant="segmented">
            <Button
              pressed={planInterval === PlanInterval.EVERY_30_DAYS}
              onClick={() => setPlanInterval(PlanInterval.EVERY_30_DAYS)}
            >
              {Labels.Monthly}
            </Button>
            <Button
              pressed={planInterval === PlanInterval.ANNUAL}
              onClick={() => setPlanInterval(PlanInterval.ANNUAL)}
            >
              {Labels.Yearly}
            </Button>
          </ButtonGroup>
        ) : undefined
      }
      fullWidth={pageWidth === "full"}
      narrowWidth={pageWidth === "narrow"}
    >
      <Box paddingBlockEnd="800">
        <Layout>
          <Layout.Section>
            <BlockStack gap="1000">
              {showSuccessBanner && (
                <Banner
                  tone="success"
                  title={Labels.SubscribeSuccessTitle}
                  onDismiss={() => {
                    setShowSuccessBanner(false);
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }}
                >
                  {Labels.SubscribeSuccessBody}
                </Banner>
              )}
              <Grid columns={columnCount()}>
                {plansToShow.map((plan, index) => {
                  const planIsRecommended =
                    plan.customFields && plan.customFields[customFieldPlanRecommended];
                  const showCustomCta = customFieldCta && plan.customFields[customFieldCta];

                  return (
                    <Grid.Cell key={`plan-${index}`} columnSpan={columnSpan()}>
                      <HighlightedPlanCard
                        plan={plan}
                        discount={plan.discounts?.length > 0 ? plan.discounts[0] : null}
                        buttonLabel={showCustomCta ? plan.customFields[customFieldCta] : undefined}
                        onSelectPlan={onSubscribe}
                        useShortFormPlanIntervals={useShortFormPlanIntervals}
                        trialDaysAsFeature={showTrialDaysAsFeature}
                        expanded={addSpacingToNonRecommendedPlans || planIsRecommended}
                        isActivePlan={currentPlan?.id === plan.id}
                        isRecommendedPlan={planIsRecommended}
                        showRecommendedPlanBadge={showRecommendedBadge}
                      />
                    </Grid.Cell>
                  );
                })}
              </Grid>
              {customPlans?.length > 0 && <Divider borderColor="border" />}
              {customPlans?.length > 0 && (
                <BlockStack gap="300">
                  <Box paddingInline={{ xs: 400, sm: 0 }}>
                    <Text variant="headingMd">{Labels.CustomPlans}</Text>
                  </Box>
                  <Grid>
                    {customPlans.map((plan, index) => {
                      const planIsRecommended =
                        plan.customFields && plan.customFields[customFieldPlanRecommended];
                      const showCustomCta = customFieldCta && plan.customFields[customFieldCta];
                      return (
                        <Grid.Cell
                          key={`custom-plan-${index}`}
                          columnSpan={columnSpan(customPlans.length)}
                        >
                          <HighlightedPlanCard
                            plan={plan}
                            discount={plan.discounts?.length > 0 ? plan.discounts[0] : null}
                            buttonLabel={
                              showCustomCta ? plan.customFields[customFieldCta] : undefined
                            }
                            onSelectPlan={onSubscribe}
                            useShortFormPlanIntervals={useShortFormPlanIntervals}
                            trialDaysAsFeature={showTrialDaysAsFeature}
                            expanded={addSpacingToNonRecommendedPlans || planIsRecommended}
                            isActivePlan={currentPlan?.id === plan.id}
                            isRecommendedPlan={planIsRecommended}
                            showRecommendedPlanBadge={showRecommendedBadge}
                            isCustomPlan
                          />
                        </Grid.Cell>
                      );
                    })}
                  </Grid>
                </BlockStack>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Box>
    </Page>
  );
};
