import {
  PlanAvailability,
  PlanInterval,
  customButtonLabel,
  isRecommendedPlan,
} from "../../../utils";
import { columnCount, columnSpan } from "../../../utils/views";
import { HighlightedPlanCard } from "./highlighted/HighlightedPlanCard";
import { HorizontalPlanCard } from "./horizontal";
import { VerticalPlanCard } from "./vertical/VerticalPlanCard";
import { Grid } from "@shopify/polaris";

/**
 * @typedef {import('@heymantle/client').Plan} Plan
 * @typedef {import('@heymantle/client').Customer} Customer
 */

/**
 * The different types of plan cards available to display
 * @readonly
 * @enum {string}
 */
export const PlanCardType = {
  /**
   * Recommended plans will be highlighted and optionally expanded
   */
  Highlighted: "highlighted",

  /**
   * All plans will be displayed in a horizontal stack based on the screen size
   */
  Horizontal: "horizontal",

  /**
   * All plans will be displayed in a vertical stack
   */
  Vertical: "vertical",
};

/**
 * Displays a stack of pre-designed plan cards, filterable by interval and stacked based on their display type.
 * @param {Object} props
 * @param {Array<Plan>} props.plans - An array of plans to display
 * @param {Customer} props.customer - The current Mantle customer object
 * @param {(plan: Plan) => void} props.onSelectPlan - A callback function to handle the plan selection process
 * @param {boolean} [props.showIntervalToggle=true] - Whether to show the interval toggle
 * @param {PlanCardType} [props.cardType=PlanCardType.Horizontal] - The type of plan card to display
 * @param {boolean} [props.trialDaysAsFeature=true] - Whether to show the trial days as a feature in the feature list
 * @param {boolean} [props.useShortFormPlanIntervals=true] - Whether to use short form plan intervals, ie. "mo" instead of "month"
 * @param {string} [props.keyForRecommended="recommended"] - The Plan custom field key to check for the recommended status
 * @param {string} [props.keyForCustomButtonLabel="buttonLabel"] - The Plan custom field key to check for the custom button label
 * @returns
 */
export const PlanCardStack = ({
  plans,
  customer,
  onSelectPlan,
  interval = PlanInterval.Every30Days,
  cardType = PlanCardType.Horizontal,
  trialDaysAsFeature = true,
  useShortFormPlanIntervals = true,
  keyForRecommended = "recommended",
  keyForCustomButtonLabel = "buttonLabel",
}) => {
  const showIntervalToggle =
    _showIntervalToggle &&
    plans.some((plan) => plan.interval === PlanInterval.Annual) &&
    plans.some((plan) => plan.interval === PlanInterval.Every30Days);

  const activeSubscription = customer?.subscription?.active ? customer.subscription : undefined;
  const currentPlan = activeSubscription?.plan;

  const [interval, setInterval] = useState(
    currentPlan?.interval || (showIntervalToggle ? PlanInterval.Annual : PlanInterval.Every30Days)
  );

  const plansToShow = showIntervalToggle
    ? plans.filter((plan) => plan.interval === interval)
    : plans;

  const _columnCount = cardType === PlanCardType.Vertical ? 1 : columnCount(plansToShow.length);
  const _columnSpan = columnSpan(_columnCount);

  return (
    <Grid columns={_columnCount}>
      {plansToShow.map((plan) => (
        <Grid.Cell columnSpan={_columnSpan} key={plan.id}>
          {cardType === PlanCardType.Highlighted && (
            <HighlightedPlanCard
              key={`HighlightedPlanCard-${plan.id}`}
              plan={plan}
              onSelectPlan={onSelectPlan}
              isActivePlan={currentPlan?.id === plan.id}
              trialDaysAsFeature={trialDaysAsFeature}
              useShortFormPlanIntervals={useShortFormPlanIntervals}
              isCustomPlan={plan.availability !== PlanAvailability.Public}
              isRecommendedPlan={isRecommendedPlan({ plan, customFieldKey: keyForRecommended })}
              buttonLabel={customButtonLabel({ plan, customFieldKey: keyForCustomButtonLabel })}
            />
          )}
          {cardType === PlanCardType.Horizontal && (
            <HorizontalPlanCard
              key={`HorizontalPlanCard-${plan.id}`}
              plan={plan}
              onSelectPlan={onSelectPlan}
              isActivePlan={currentPlan?.id === plan.id}
              trialDaysAsFeature={trialDaysAsFeature}
              useShortFormPlanIntervals={useShortFormPlanIntervals}
              isRecommendedPlan={isRecommendedPlan({ plan, customFieldKey: keyForRecommended })}
              buttonLabel={customButtonLabel({ plan, customFieldKey: keyForCustomButtonLabel })}
            />
          )}
        </Grid.Cell>
      ))}
    </Grid>
  );
};
