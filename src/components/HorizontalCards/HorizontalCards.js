import { useState } from "react";
import { CheckIcon, PlusIcon } from "@shopify/polaris-icons";
import { Badge, Banner, Box, BlockStack, Button, ButtonGroup, Card, Divider, Grid, InlineStack, Icon, Layout, Page, Text } from "@shopify/polaris";

const LABELS = {
  BACK: "Back",
  CURRENCY_SYMBOL: "$",
  CURRENT_PLAN: "Current plan",
  CUSTOM_PLANS: "Custom plans",
  CUSTOM_PLANS_DESCRIPTION: "Plans tailored to your specific needs",
  FREE_TRIAL_LENGTH: "{{ trialDays }}-day free trial",
  MONTH: "month",
  MONTH_SHORT: "mo",
  MONTHLY: "Monthly",
  MOST_POPULAR: "Most popular",
  PER: "/",
  PLANS: "Plans",
  SELECT_PLAN: "Select plan",
  SUBSCRIBE_SUCCESS_TITLE: "Subscription successful",
  SUBSCRIBE_SUCCESS_BODY: "Thanks for subscribing to our app!",
  YEAR: "year",
  YEAR_SHORT: "yr",
  YEARLY: "Yearly",
}

const PLAN_INTERVALS = {
  EVERY_30_DAYS: "EVERY_30_DAYS",
  ANNUAL: "ANNUAL",
}

export const HorizontalCards = ({
    customer,
    plans,
    onSubscribe,
    backUrl = "", // string: URL to use as "back" breadcrumb URL. leave as empty string or null to hide the back button
    showRecommendedBadge = true, // boolean
    customFieldCta = null, // string: value of the custom plan field to use as the CTA. e.g. "cta"
    customFieldPlanRecommended = "Recommended", // string: value of the custom plan field to use as the recommended badge
    showCurrencySymbol = true, // boolean
    showPlanIntervalToggle = true, // boolean
    showTrialDaysAsFeature = true, // boolean
    useShortFormPlanIntervals = true, // boolean: e.g. show "$ / mo" instead of "$ / month"
    pageWidth = "default", // string: "full", "narrow", or "default"
    showCustomPlans = true, // boolean: show custom plans
  }) => {
  const { subscription } = customer;
  const urlParams = new URLSearchParams(window.location.search);
  const hasMonthlyAndYearlyPlans = plans.some((plan) => plan.interval === PLAN_INTERVALS.ANNUAL) && plans.some((plan) => plan.interval === PLAN_INTERVALS.EVERY_30_DAYS);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan.id);
  const [planInterval, setPlanInterval] = useState(currentPlan ? currentPlan.interval : hasMonthlyAndYearlyPlans ? PLAN_INTERVALS.ANNUAL : PLAN_INTERVALS.EVERY_30_DAYS);
  const availablePlans = plans.filter((plan) => plan.availability !== "customerTag" && plan.availability !== "customer");
  const plansToShow = showPlanIntervalToggle && hasMonthlyAndYearlyPlans ? availablePlans.filter((plan) => plan.interval === planInterval) : availablePlans;
  const customPlans = showCustomPlans ? plans.filter((plan) => plan.availability === "customerTag" || plan.availability === "customer") : [];
  const [showSuccessBanner, setShowSuccessBanner] = useState(urlParams.get("subscribed") === "true");

  const columnSpan = (count = plansToShow.length) => {
    if (count % 4 === 0) return { xs: 6, sm: 6, md: 2, lg: 3, xl: 3 };
    if (count % 3 === 0) return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
    if (count % 2 === 0) return { xs: 6, sm: 6, md: 3, lg: 6, xl: 6 };
    if (count === 1) return { xs: 6, sm: 6, md: 6, lg: 12, xl: 12 };
    return { xs: 6, sm: 6, md: 2, lg: 4, xl: 4 };
  }

  const titleComponent = ({ plan, discount }) => {
    const planIsRecommended = plan.customFields && plan.customFields[customFieldPlanRecommended];
    return (
      <BlockStack>
        <InlineStack align="space-between" gap="100">
          <Text variant="bodyLg">
            {plan.name}
          </Text>
          {planIsRecommended && showRecommendedBadge && (
            <Badge tone="success">{LABELS.MOST_POPULAR}</Badge>
          )}
        </InlineStack>
        {plan.description && (
          <Text tone="subdued">
            {plan.description}
          </Text>
        )}
      </BlockStack>
    )
  }

  const featuresComponent = ({ plan, discount }) => {
    return (
      <BlockStack gap="100">
        {showTrialDaysAsFeature && plan.trialDays !== 0 && (
          <InlineStack align="start" gap="100">
            <Box>
              <Icon source={CheckIcon} tone="positive" />
            </Box>
            <Text tone="subdued">{LABELS.FREE_TRIAL_LENGTH.replace("{{ trialDays }}", plan.trialDays)}</Text>
          </InlineStack>
        )}
        {plan.featuresOrder.map((feature, index) => {
          const planFeature = plan.features[feature];
          const showFeature = planFeature.type !== "boolean" || planFeature.value === true;
          if (showFeature) {
            return (
              <InlineStack key={`plan-feature-${index}`} align="start" gap="100">
                <Box>
                  <Icon source={CheckIcon} tone="positive" />
                </Box>
                {planFeature.type === "boolean" ? (
                  <Text tone="subdued">
                    {planFeature.name}
                  </Text>
                ) : (
                  <Text tone="subdued">
                    {planFeature.value} {planFeature.name}
                  </Text>
                )}
              </InlineStack>
            )
          }
        })}
      </BlockStack>
    )
  }

  const pricingComponent = ({ plan, discount }) => {
    return (
      <BlockStack gap="100">
        {discount ? (
          <InlineStack blockAlign="center" gap="200">
            <Text variant="headingXl">
              {showCurrencySymbol && LABELS.CURRENCY_SYMBOL}{discount.discountedAmount}
            </Text>
            <Text variant="headingXl" tone="subdued" fontWeight="medium" textDecorationLine="line-through">
              {plan.amount}
            </Text>
            <Text variant="bodyLg" tone="subdued">
              {LABELS.PER} {plan.interval === PLAN_INTERVALS.ANNUAL ? useShortFormPlanIntervals ? LABELS.YEAR_SHORT : LABELS.YEAR : useShortFormPlanIntervals ? LABELS.MONTH_SHORT : LABELS.MONTH}
            </Text>
          </InlineStack>
        ) : (
          <InlineStack blockAlign="center" gap="200">
            <Text alignment="center" variant="headingXl">
              {showCurrencySymbol && LABELS.CURRENCY_SYMBOL}{plan.amount}
            </Text>
            <Text alignment="center" variant="bodyLg" tone="subdued">
              {LABELS.PER} {plan.interval === PLAN_INTERVALS.ANNUAL ? useShortFormPlanIntervals ? LABELS.YEAR_SHORT : LABELS.YEAR : useShortFormPlanIntervals ? LABELS.MONTH_SHORT : LABELS.MONTH}
            </Text>
          </InlineStack>
        )}
        {plan.usageCharges.length > 0 && (
          <BlockStack>
            {plan.usageCharges.map((usageCharge, index) => {
              return (
                <InlineStack key={`plan-usageCharge-${index}`} align="start" gap="100">
                  <Box>
                    <Icon source={PlusIcon} tone="positive" />
                  </Box>
                  <Text variant="bodyLg">{usageCharge.terms}</Text>
                </InlineStack>
              )
            })}
          </BlockStack>
        )}
      </BlockStack>
    )
  }

  const ctaComponent = ({ plan, discount }) => {
    const showCustomCta = customFieldCta && plan.customFields[customFieldCta];
    const planIsRecommended = plan.customFields && plan.customFields[customFieldPlanRecommended];
    return (
      <Button
        size="large"
        variant={planIsRecommended ? "primary" : "secondary"}
        onClick={() => onSubscribe({ planId: plan.id, discountId: discount?.id })}
        disabled={currentPlan?.id === plan.id}
      >
        {currentPlan?.id === plan.id ? LABELS.CURRENT_PLAN : showCustomCta ? plan.customFields[customFieldCta] : LABELS.SELECT_PLAN}
      </Button>
    )
  }

  return (
    <Page
      title={LABELS.PLANS}
      backAction={backUrl !== "" ? { content: LABELS.BACK, url: backUrl } : undefined}
      secondaryActions={showPlanIntervalToggle && hasMonthlyAndYearlyPlans ? (
        <ButtonGroup variant="segmented">
          <Button
            pressed={planInterval === PLAN_INTERVALS.EVERY_30_DAYS}
            onClick={() => setPlanInterval(PLAN_INTERVALS.EVERY_30_DAYS)}
          >
            {LABELS.MONTHLY}
          </Button>
          <Button
            pressed={planInterval === PLAN_INTERVALS.ANNUAL}
            onClick={() => setPlanInterval(PLAN_INTERVALS.ANNUAL)}
          >
            {LABELS.YEARLY}
          </Button>
        </ButtonGroup>
      ) : undefined}
      fullWidth={pageWidth === "full"}
      narrowWidth={pageWidth === "narrow"}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="1000">
            {showSuccessBanner && (
              <Banner
                tone="success"
                title={LABELS.SUBSCRIBE_SUCCESS_TITLE}
                onDismiss={() => {
                  setShowSuccessBanner(false);
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
              >
                {LABELS.SUBSCRIBE_SUCCESS_BODY}
              </Banner>
            )}
            <Grid>
              {plansToShow.map((plan, index) => {
                const discount = plan.discounts?.length > 0 ? plan.discounts.reduce((prev, current) => (prev.discountedAmount < current.discountedAmount) ? prev : current) : null;
                return (
                  <Grid.Cell key={`plan-${index}`} columnSpan={columnSpan()}>
                    <Card>
                      <BlockStack gap="400">
                        {titleComponent({ plan, discount })}
                        {pricingComponent({ plan, discount })}
                        {ctaComponent({ plan, discount })}
                        {featuresComponent({ plan, discount })}
                      </BlockStack>
                    </Card>
                  </Grid.Cell>
                )
              })}
            </Grid>
            {customPlans?.length > 0 && <Divider borderColor="border" />}
            {customPlans?.length > 0 && (
              <BlockStack gap="300">
                <Box paddingInline={{ xs: 400, sm: 0 }}>
                  <Text variant="headingMd">{LABELS.CUSTOM_PLANS}</Text>
                </Box>
                <Grid>
                  {customPlans.map((plan, index) => {
                    const discount = plan.discounts?.length > 0 ? plan.discounts.reduce((prev, current) => (prev.discountedAmount < current.discountedAmount) ? prev : current) : null;
                    return (
                      <Grid.Cell key={`custom-plan-${index}`} columnSpan={columnSpan()}>
                        <Card>
                          <BlockStack gap="400">
                            {titleComponent({ plan, discount })}
                            {pricingComponent({ plan, discount })}
                            {ctaComponent({ plan, discount })}
                            {featuresComponent({ plan, discount })}
                          </BlockStack>
                        </Card>
                      </Grid.Cell>
                    )
                  })}
                </Grid>
              </BlockStack>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}