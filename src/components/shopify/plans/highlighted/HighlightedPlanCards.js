import React, { useState } from "react";
import { CheckIcon, PlusIcon } from "@shopify/polaris-icons";
import {
  Badge,
  Banner,
  Box,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  InlineStack,
  Icon,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import { Labels, PlanInterval, intervalLabel, money } from "../../../../utils";

export const HighlightedPlanCards = ({
  customer,
  plans,
  onSubscribe,
  backUrl = "", // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
  showRecommendedBadge = true, // boolean
  customFieldCta = null, // string: value of the custom plan field to use as the CTA. e.g. "cta"
  customFieldPlanRecommended = "Recommended", // string: value of the custom plan field to use as the recommended badge
  addSpacingToNonRecommendedPlans = true, // boolean
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

  const titleComponent = (plan) => {
    return (
      <BlockStack gap="100">
        <Text variant="headingMd" alignment="center">
          {plan.name}
        </Text>
        {plan.description && (
          <Text variant="bodyLg" tone="subdued" alignment="center">
            {plan.description}
          </Text>
        )}
      </BlockStack>
    );
  };

  const featuresComponent = (plan) => {
    return (
      <BlockStack gap="300">
        {showTrialDaysAsFeature && plan.trialDays !== 0 && (
          <InlineStack align="center" blockAlign="center" gap="100">
            <Box>
              <Icon source={CheckIcon} tone="positive" />
            </Box>
            <Text tone="subdued">
              {Labels.FreeTrialLength.replace("{{ trialDays }}", plan.trialDays)}
            </Text>
          </InlineStack>
        )}
        {plan.featuresOrder.map((feature, index) => {
          const planFeature = plan.features[feature];
          const showFeature = planFeature.type !== "boolean" || planFeature.value === true;
          if (showFeature) {
            return (
              <InlineStack key={`plan-feature-${index}`} align="center" gap="100">
                <Box>
                  <Icon source={CheckIcon} tone="positive" />
                </Box>
                {planFeature.type === "boolean" ? (
                  <Text tone="subdued">{planFeature.name}</Text>
                ) : (
                  <Text tone="subdued">
                    {planFeature.value} {planFeature.name}
                  </Text>
                )}
              </InlineStack>
            );
          }
        })}
      </BlockStack>
    );
  };

  const pricingComponent = (plan) => {
    let discountedAmount = plan.amount;
    for (const discount of plan.discounts) {
      discountedAmount = discount.percentage
        ? plan.amount - plan.amount * (discount.percentage / 100)
        : plan.amount - discount.amount;
    }
    return (
      <BlockStack gap="100">
        {plan.discounts.length > 0 ? (
          <InlineStack align="center" blockAlign="center" gap="200">
            <Text variant="heading3xl">{money(discountedAmount, plan.currency, true)}</Text>
            <Text
              variant="heading3xl"
              tone="subdued"
              fontWeight="medium"
              textDecorationLine="line-through"
            >
              {money(plan.amount, plan.currency, true)}
            </Text>
            <Text variant="bodyLg" tone="subdued">
              {Labels.Per} {intervalLabel({ interval: plan.interval, useShortFormPlanIntervals })}
            </Text>
          </InlineStack>
        ) : (
          <InlineStack align="center" blockAlign="center" gap="200">
            <Text alignment="center" variant="heading3xl">
              {money(plan.amount, plan.currency, true)}
            </Text>
            <Text alignment="center" variant="bodyLg" tone="subdued">
              {Labels.Per} {intervalLabel({ interval: plan.interval, useShortFormPlanIntervals })}
            </Text>
          </InlineStack>
        )}
        {plan.usageCharges.length > 0 && (
          <BlockStack>
            {plan.usageCharges.map((usageCharge, index) => {
              return (
                <InlineStack key={`plan-usageCharge-${index}`} align="center" gap="100">
                  <Box>
                    <Icon source={PlusIcon} tone="positive" />
                  </Box>
                  <Text variant="bodyLg">{usageCharge.terms}</Text>
                </InlineStack>
              );
            })}
          </BlockStack>
        )}
      </BlockStack>
    );
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
                      <Box position="relative" minHeight="100%">
                        <Box
                          paddingBlock={
                            !addSpacingToNonRecommendedPlans || planIsRecommended
                              ? undefined
                              : "800"
                          }
                          minHeight="100%"
                        >
                          <Box
                            background={planIsRecommended ? "bg-surface" : "bg-surface-secondary"}
                            borderStyle="solid"
                            borderColor="border"
                            borderWidth="025"
                            paddingBlock={
                              addSpacingToNonRecommendedPlans && planIsRecommended ? "1600" : "800"
                            }
                            paddingInline="400"
                            borderRadius="200"
                            minHeight={`calc(100% - calc(var(--p-space-800) * 2))`}
                          >
                            <BlockStack gap="800">
                              <BlockStack gap="400">
                                {titleComponent(plan)}
                                {pricingComponent(plan)}
                              </BlockStack>
                              <Button
                                size="large"
                                variant={planIsRecommended ? "primary" : "secondary"}
                                onClick={() => onSubscribe(plan)}
                              >
                                {showCustomCta
                                  ? plan.customFields[customFieldCta]
                                  : Labels.SelectPlan}
                              </Button>
                              {featuresComponent(plan)}
                              {planIsRecommended && showRecommendedBadge && (
                                <InlineStack key={`plan-feature-${index}`} align="center" gap="100">
                                  <Badge tone="success">{Labels.MostPopular}</Badge>
                                </InlineStack>
                              )}
                            </BlockStack>
                          </Box>
                        </Box>
                      </Box>
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
                          <Card>
                            <BlockStack gap="400">
                              {titleComponent(plan)}
                              {pricingComponent(plan)}
                              <Button
                                size="large"
                                variant={planIsRecommended ? "primary" : "secondary"}
                                onClick={() => onSubscribe(plan)}
                              >
                                {showCustomCta
                                  ? plan.customFields[customFieldCta]
                                  : Labels.SelectPlan}
                              </Button>
                              {featuresComponent(plan)}
                            </BlockStack>
                          </Card>
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
